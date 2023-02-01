import React, { useContext, useRef, useState } from 'react';
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
import { User, USER_GROUP } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
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
        user: yup.object().nullable().required('A user must be selected'),
        group: yup.string().required('A role must be specified'),
        engagement: yup
            .object()
            .nullable()
            .when('group', {
                is: USER_GROUP.VIEWER.value,
                then: yup.object().required('An engagement must be selected'),
            }),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddUserModel = () => {
    const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModelOpen } = useContext(UserManagementContext);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

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

    const userTypeSelected = watch('group');

    const { user: userErrors, group: groupErrors, engagement: engagementErrors } = errors;

    const handleClose = () => {
        setAddUserModelOpen(false);
        reset({});
        setBackendError('');
    };

    const loadUsers = async (searchText: string) => {
        if (searchText.length < 3) {
            return;
        }
        try {
            setUsersLoading(true);
            const response = await getUserList({
                search_text: searchText,
                include_groups: false,
            });
            setUsers(response.items);
            setUsersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setUsersLoading(false);
        }
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

    const debounceLoadUsers = useRef(
        debounce((searchText: string) => {
            loadUsers(searchText);
        }, 1000),
    ).current;

    const debounceLoadEngagements = useRef(
        debounce((searchText: string) => {
            loadEngagements(searchText);
        }, 1000),
    ).current;

    const assignRoleToUser = async (data: AddUserForm) => {
        if (userTypeSelected === USER_GROUP.ADMIN.value) {
            return addUserToGroup({ user_id: data.user?.external_id, group: data.group });
        } else
            return addTeamMemberToEngagement({
                user_id: data.user?.external_id,
                engagement_id: data.engagement?.id,
            });
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
            await assignRoleToUser(data);
            dispatch(openNotification({ severity: 'success', text: 'User has been successfully added' }));
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
                                <MetHeader3 bold>Add a User</MetHeader3>
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
                                        Select the user you want to add
                                    </MetLabel>

                                    <Controller
                                        control={control}
                                        name="user"
                                        render={({ field: { ref, onChange, ...field } }) => (
                                            <Autocomplete
                                                options={users || []}
                                                onChange={(_, data) => {
                                                    onChange(data);
                                                }}
                                                onInputChange={(_event, newInputValue) => {
                                                    debounceLoadUsers(newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        {...field}
                                                        inputRef={ref}
                                                        fullWidth
                                                        placeholder="Type at least 3 letters of the user's name"
                                                        error={Boolean(userErrors)}
                                                        helperText={String(userErrors?.message || '')}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {usersLoading ? (
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
                                                getOptionLabel={(user: User) => `${user.first_name} ${user.last_name}`}
                                                loading={usersLoading}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl error={Boolean(errors['group'])}>
                                        <FormLabel
                                            id="controlled-radio-buttons-group"
                                            sx={{ fontWeight: 'bold', color: Palette.text.primary }}
                                        >
                                            What role would you like to assign to this user?
                                        </FormLabel>
                                        <ControlledRadioGroup name="group">
                                            <FormControlLabel
                                                value={USER_GROUP.ADMIN.value}
                                                control={<Radio />}
                                                label={'Administrator'}
                                            />
                                            <FormControlLabel
                                                value={USER_GROUP.VIEWER.value}
                                                control={<Radio />}
                                                label={'Team Member'}
                                            />
                                        </ControlledRadioGroup>
                                        <When condition={Boolean(groupErrors)}>
                                            <FormHelperText>{String(groupErrors?.message)}</FormHelperText>
                                        </When>
                                    </FormControl>
                                </Grid>
                                <When condition={userTypeSelected === USER_GROUP.VIEWER.value}>
                                    <Grid item xs={12}>
                                        <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                            Which Engagement would you like to add this Team Member to?
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
