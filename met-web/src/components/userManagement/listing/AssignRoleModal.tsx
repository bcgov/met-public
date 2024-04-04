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
import { USER_COMPOSITE_ROLE } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToRole } from 'services/userService/api';
import { addTeamMemberToEngagement } from 'services/membershipService';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import axios, { AxiosError } from 'axios';
import { getEngagements } from 'services/engagementService';
import { debounce } from 'lodash';
import { Engagement } from 'models/engagement';

const schema = yup
    .object({
        role: yup.string().required('A role must be specified'),
        engagement: yup
            .object()
            .nullable()
            .when('role', {
                is: USER_COMPOSITE_ROLE.REVIEWER.value,
                then: yup.object().nullable().required('An engagement must be selected'),
            }),
    })
    .required();

type AssignRoleForm = yup.TypeOf<typeof schema>;

export const AssignRoleModal = () => {
    const dispatch = useAppDispatch();
    const { assignRoleModalOpen, setassignRoleModalOpen, user, loadUserListing } = useContext(UserManagementContext);
    const [isAssigningRole, setIsAssigningRole] = useState(false);

    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [engagementsLoading, setEngagementsLoading] = useState(false);
    const [backendError, setBackendError] = useState('');
    const theme = useTheme();

    const methods = useForm<AssignRoleForm>({
        resolver: yupResolver(schema),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
        watch,
    } = methods;

    const userTypeSelected = watch('role');

    const formValues = watch();
    useEffect(() => {
        if (backendError) {
            setBackendError('');
        }
    }, [JSON.stringify(formValues)]);

    const { role: roleErrors, engagement: engagementErrors } = errors;

    const handleClose = () => {
        setassignRoleModalOpen(false);
        reset({});
        setBackendError('');
    };

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== 409) {
            return;
        }
        setBackendError(error.response?.data.message || '');
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

    const assignRoleToUser = async (data: AssignRoleForm) => {
        if (userTypeSelected === USER_COMPOSITE_ROLE.ADMIN.value) {
            await addUserToRole({ user_id: user?.external_id, role: data.role });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully added ${user?.first_name} ${user?.last_name} to the role ${USER_COMPOSITE_ROLE.ADMIN.label}`,
                }),
            );
        } else if (userTypeSelected === USER_COMPOSITE_ROLE.VIEWER.value) {
            await addUserToRole({ user_id: user?.external_id, role: data.role });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully added ${user?.first_name} ${user?.last_name} to the role ${USER_COMPOSITE_ROLE.VIEWER.label}`,
                }),
            );
        } else {
            await addUserToRole({ user_id: user?.external_id, role: data.role });
            await addTeamMemberToEngagement({
                user_id: user?.external_id,
                engagement_id: data.engagement?.id,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully added ${user?.first_name} ${user?.last_name} as a ${data.role} on ${data.engagement?.name}.`,
                }),
            );
        }
    };

    const onSubmit: SubmitHandler<AssignRoleForm> = async (data: AssignRoleForm) => {
        try {
            setIsAssigningRole(true);
            await assignRoleToUser(data);
            setIsAssigningRole(false);
            loadUserListing();
            handleClose();
        } catch (error) {
            setIsAssigningRole(false);
            if (axios.isAxiosError(error)) {
                setErrors(error);
            }
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while assigning role to the user' }),
            );
        }
    };

    return (
        <Modal open={assignRoleModalOpen} onClose={handleClose} keepMounted={false}>
            <Paper sx={{ ...modalStyle }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12} mb={2}>
                                <MetHeader3 bold>Assign Role to {user?.first_name + ' ' + user?.last_name}</MetHeader3>
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
                                    <FormControl error={Boolean(errors['role'])}>
                                        <FormLabel
                                            id="controlled-radio-buttons-group"
                                            sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
                                        >
                                            What role would you like to assign to this user?
                                        </FormLabel>
                                        <ControlledRadioGroup name="role">
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.VIEWER.value}
                                                control={<Radio />}
                                                label={'Viewer'}
                                            />
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.REVIEWER.value}
                                                control={<Radio />}
                                                label={'Reviewer'}
                                            />
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.TEAM_MEMBER.value}
                                                control={<Radio />}
                                                label={'Team Member'}
                                            />
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.ADMIN.value}
                                                control={<Radio />}
                                                label={'Administrator'}
                                            />
                                        </ControlledRadioGroup>
                                        <When condition={Boolean(roleErrors)}>
                                            <FormHelperText>{String(roleErrors?.message)}</FormHelperText>
                                        </When>
                                    </FormControl>
                                </Grid>
                                <When
                                    condition={
                                        userTypeSelected === USER_COMPOSITE_ROLE.TEAM_MEMBER.value ||
                                        userTypeSelected === USER_COMPOSITE_ROLE.REVIEWER.value
                                    }
                                >
                                    <Grid item xs={12}>
                                        <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                            Which engagement would you like to assign{' '}
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
