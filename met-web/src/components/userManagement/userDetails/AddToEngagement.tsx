import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Autocomplete, CircularProgress, Grid, Paper, Stack, TextField, useTheme } from '@mui/material';
import { MetHeader3, MetLabel, MetSmallText, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User, USER_GROUP } from 'models/user';
import { ActionContext } from './UserActionProvider';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToGroup, getUserList } from 'services/userService/api';
import { getEngagements } from 'services/engagementService';
import { addTeamMemberToEngagement } from 'services/membershipService';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { debounce } from 'lodash';
import { Engagement } from 'models/engagement';
import axios, { AxiosError } from 'axios';

const schema = yup
    .object({
        engagement: yup.object().nullable(),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddToEngagementModal = () => {
    const dispatch = useAppDispatch();
    const { savedUser, addUserModalOpen, setAddUserModalOpen, loadUserListing } = useContext(ActionContext);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [engagementsLoading, setEngagementsLoading] = useState(false);
    const [backendError, setBackendError] = useState('');

    const theme = useTheme();

    const methods = useForm<AddUserForm>({
        resolver: yupResolver(schema),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
        watch,
    } = methods;

    const formValues = watch();
    useEffect(() => {
        if (backendError) {
            setBackendError('');
        }
    }, [JSON.stringify(formValues)]);

    const { engagement: engagementErrors } = errors;

    const handleClose = () => {
        setAddUserModalOpen(false);
        reset({});
        setBackendError('');
    };

    const loadEngagements = async (searchText: string) => {
        if (searchText.length < 3) {
            return;
        }
        try {
            setEngagementsLoading(true);
            const response = await getEngagements({
                search_text: searchText,
            });
            setEngagements(response.items);
            setEngagementsLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch engagements, please refresh the page or try again at a later time',
                }),
            );
            setEngagementsLoading(false);
        }
    };

    const debounceLoadEngagements = useRef(
        debounce((searchText: string) => {
            loadEngagements(searchText);
        }, 1000),
    ).current;

    const addUserToEngagement = async (data: AddUserForm) => {
        await addTeamMemberToEngagement({
            user_id: savedUser?.external_id,
            engagement_id: data.engagement?.id,
        });
        dispatch(
            openNotification({
                severity: 'success',
                text: `You have successfully added ${savedUser?.username} as a Team Member on ${data.engagement?.name}.`,
            }),
        );
    };

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== 409) {
            return;
        }
        setBackendError(error.response?.data.message || '');
    };

    const onSubmit: SubmitHandler<AddUserForm> = async (data: AddUserForm) => {
        try {
            setIsAssigningRole(true);
            await addUserToEngagement(data);
            setIsAssigningRole(false);
            loadUserListing();
            handleClose();
        } catch (error) {
            setIsAssigningRole(false);
            if (axios.isAxiosError(error)) {
                setErrors(error);
            }
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add user' }));
        }
    };

    return (
        <Modal open={addUserModalOpen} onClose={handleClose} keepMounted={false}>
            <Paper sx={{ ...modalStyle }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12}>
                                <MetHeader3 bold>Add {savedUser?.username} to Engagement</MetHeader3>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                container
                                direction="row"
                                alignItems="flex-start"
                                justifyContent="flex-start"
                                rowSpacing={4}
                            >
                                <Grid item xs={12}>
                                    <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                        Which Engagement would you like to add {savedUser?.username} to?
                                    </MetLabel>
                                    <Controller
                                        control={control}
                                        name="engagement"
                                        render={({ field: { ref, onChange, ...field } }) => (
                                            <Autocomplete
                                                options={engagements || []}
                                                onChange={(_, data) => {
                                                    onChange(data);
                                                }}
                                                onInputChange={(_event, newInputValue) => {
                                                    debounceLoadEngagements(newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        {...field}
                                                        inputRef={ref}
                                                        fullWidth
                                                        placeholder="Type at least 3 letters of the engagement's name"
                                                        error={Boolean(engagementErrors)}
                                                        helperText={String(engagementErrors?.message || '')}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {engagementsLoading ? (
                                                                        <CircularProgress
                                                                            color="primary"
                                                                            size={20}
                                                                            sx={{ marginRight: '2em' }}
                                                                        />
                                                                    ) : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                                getOptionLabel={(engagement: Engagement) => engagement.name}
                                                loading={engagementsLoading}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <When condition={backendError}>
                                <Grid item xs={12}>
                                    <MetSmallText sx={{ color: theme.palette.error.main }}>{backendError}</MetSmallText>
                                </Grid>
                            </When>

                            <Grid
                                item
                                container
                                xs={12}
                                direction="row"
                                justifyContent="flex-end"
                                spacing={1}
                                sx={{ mt: '1em' }}
                            >
                                <Stack
                                    direction={{ md: 'column-reverse', lg: 'row' }}
                                    spacing={1}
                                    width="100%"
                                    justifyContent="flex-end"
                                >
                                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                                    <PrimaryButton loading={isAssigningRole} type="submit">
                                        Submit
                                    </PrimaryButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Paper>
        </Modal>
    );
};
