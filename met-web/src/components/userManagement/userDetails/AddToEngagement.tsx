import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import {
    Autocomplete,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Paper,
    Radio,
    Stack,
    TextField,
    useTheme,
} from '@mui/material';
import { MetHeader3, MetLabel, MetSmallText, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { USER_GROUP } from 'models/user';
import { ActionContext } from './UserActionProvider';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getEngagements } from 'services/engagementService';
import { addUserToGroup } from 'services/userService/api';
import { addTeamMemberToEngagement } from 'services/membershipService';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { debounce } from 'lodash';
import { Engagement } from 'models/engagement';
import axios, { AxiosError } from 'axios';
import { Palette } from 'styles/Theme';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';

export const AddToEngagementModal = () => {
    const { savedUser, addUserModalOpen, setAddUserModalOpen, getUserEngagements, getUserDetails } =
        useContext(ActionContext);
    const userHasGroup = savedUser?.groups && savedUser?.groups.length > 0;
    const schema = yup
        .object({
            engagement: yup.object().nullable(),
            group: yup.string().when([], {
                is: () => savedUser?.groups.length === 0,
                then: yup.string().required('A role must be specified'),
                otherwise: yup.string(),
            }),
        })
        .required();

    type AddUserForm = yup.TypeOf<typeof schema>;

    const dispatch = useAppDispatch();
    const { assignedEngagements } = useAppSelector((state) => state.user);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [engagementsLoading, setEngagementsLoading] = useState(false);
    const [backendError, setBackendError] = useState('');
    const userHasRole = savedUser?.groups && savedUser?.groups.length > 0;

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

    const userTypeSelected = watch('group');

    const formValues = watch();
    useEffect(() => {
        if (backendError) {
            setBackendError('');
        }
    }, [JSON.stringify(formValues)]);

    const { group: groupErrors, engagement: engagementErrors } = errors;

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
            const filteredEngagements = response.items.filter(
                (engagement) => !assignedEngagements.includes(engagement.id),
            );
            setEngagements(filteredEngagements);
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
        if (userHasGroup) {
            await addTeamMemberToEngagement({
                user_id: savedUser?.external_id,
                engagement_id: data.engagement?.id,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully added ${savedUser?.first_name + ' ' + savedUser?.last_name} as a ${
                        savedUser?.main_group
                    } on ${data.engagement?.name}.`,
                }),
            );
        } else {
            if (userTypeSelected === USER_GROUP.ADMIN.value) {
                await addUserToGroup({ user_id: savedUser?.external_id, group: data.group ?? '' });
                dispatch(
                    openNotification({
                        severity: 'success',
                        text: `You have successfully added ${savedUser?.first_name} ${savedUser?.last_name} to the group ${USER_GROUP.ADMIN.label}`,
                    }),
                );
            } else {
                await addUserToGroup({ user_id: savedUser?.external_id, group: data.group ?? '' });
                await addTeamMemberToEngagement({
                    user_id: savedUser?.external_id,
                    engagement_id: data.engagement?.id,
                });
                dispatch(
                    openNotification({
                        severity: 'success',
                        text: `You have successfully added ${savedUser?.first_name} ${savedUser?.last_name} as a ${data.group} on ${data.engagement?.name}.`,
                    }),
                );
            }
            getUserDetails();
        }
        getUserEngagements();
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
                                <When condition={!userHasGroup}>
                                    <MetHeader3 bold>
                                        Assign Role to {savedUser?.first_name + ' ' + savedUser?.last_name}
                                    </MetHeader3>
                                </When>
                                <When condition={userHasGroup}>
                                    <MetHeader3 bold>
                                        Add {savedUser?.first_name + ' ' + savedUser?.last_name} to Engagement
                                    </MetHeader3>
                                </When>
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
                                <When condition={!userHasGroup}>
                                    <Grid item xs={12}>
                                        <FormControl error={Boolean(errors['group'])}>
                                            <FormLabel
                                                id="controlled-radio-buttons-group"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: Palette.text.primary,
                                                    paddingBottom: 1,
                                                }}
                                            >
                                                What role would you like to assign to this user?
                                            </FormLabel>
                                            <ControlledRadioGroup name="group">
                                                <FormControlLabel
                                                    value={USER_GROUP.ADMIN.value}
                                                    control={<Radio />}
                                                    label={'Superuser'}
                                                />
                                                <FormControlLabel
                                                    value={USER_GROUP.TEAM_MEMBER.value}
                                                    control={<Radio />}
                                                    label={'Team Member'}
                                                />
                                                <FormControlLabel
                                                    value={USER_GROUP.REVIEWER.value}
                                                    control={<Radio />}
                                                    label={'Reviewer'}
                                                />
                                            </ControlledRadioGroup>
                                            <When condition={Boolean(groupErrors)}>
                                                <FormHelperText>{String(groupErrors?.message)}</FormHelperText>
                                            </When>
                                        </FormControl>
                                    </Grid>
                                </When>
                                <When
                                    condition={
                                        userTypeSelected === USER_GROUP.TEAM_MEMBER.value ||
                                        userTypeSelected === USER_GROUP.REVIEWER.value ||
                                        userHasGroup
                                    }
                                >
                                    <Grid item xs={12}>
                                        <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                            Which Engagement would you like to add{' '}
                                            {savedUser?.first_name + ' ' + savedUser?.last_name} to?
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
                                </When>
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
