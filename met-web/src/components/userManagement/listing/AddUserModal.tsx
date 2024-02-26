import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Autocomplete, CircularProgress, Grid, Paper, Stack, TextField, useTheme } from '@mui/material';
import { MetHeader3, MetLabel, MetSmallText, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { UserManagementContext } from './UserManagementContext';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

export const AddUserModal = () => {
    const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModalOpen, user, loadUserListing } = useContext(UserManagementContext);
    const [isAddingToEngagement, setIsAddingToEngagement] = useState(false);
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
                has_team_access: true,
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
            loadEngagements(searchText).catch((error) => {
                console.error('Error in debounceLoadEngagements:', error);
            });
        }, 1000),
    ).current;

    const addUserToEngagement = async (data: AddUserForm) => {
        await addTeamMemberToEngagement({
            user_id: user?.external_id,
            engagement_id: data.engagement?.id,
        });
        dispatch(
            openNotification({
                severity: 'success',
                text: `You have successfully added ${user?.first_name + ' ' + user?.last_name} as a ${
                    user?.main_role
                } on ${data.engagement?.name}.`,
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
            setIsAddingToEngagement(true);
            await addUserToEngagement(data);
            setIsAddingToEngagement(false);
            loadUserListing();
            handleClose();
        } catch (error) {
            setIsAddingToEngagement(false);
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
                                <MetHeader3 bold>
                                    Add {user?.first_name + ' ' + user?.last_name} to Engagement
                                </MetHeader3>
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
                                        Which Engagement would you like to add{' '}
                                        {user?.first_name + ' ' + user?.last_name} to?
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
                                    <PrimaryButton loading={isAddingToEngagement} type="submit">
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
