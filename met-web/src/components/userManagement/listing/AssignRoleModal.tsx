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
import { User, USER_GROUP } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToGroup, getUserList } from 'services/userService/api';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { debounce } from 'lodash';
import axios, { AxiosError } from 'axios';

const schema = yup
    .object({
        user: yup.object().nullable().required('A user must be selected'),
        group: yup.string().required('A role must be specified'),
    })
    .required();

type AssignRoleForm = yup.TypeOf<typeof schema>;

export const AssignRoleModal = () => {
    const dispatch = useAppDispatch();
    const { assignRoleModalOpen, setassignRoleModalOpen, loadUserListing } = useContext(UserManagementContext);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

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

    const formValues = watch();
    useEffect(() => {
        if (backendError) {
            setBackendError('');
        }
    }, [JSON.stringify(formValues)]);

    const { user: userErrors, group: groupErrors } = errors;

    const handleClose = () => {
        setassignRoleModalOpen(false);
        reset({});
        setBackendError('');
    };

    const loadUserOptions = async (searchText: string) => {
        if (searchText.length < 3) {
            return;
        }
        try {
            setUsersLoading(true);
            const response = await getUserList({
                search_text: searchText,
                include_groups: true,
            });
            setUsers(
                response.items.filter(function (item) {
                    return item.groups.length == 0;
                }),
            );
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

    const debounceLoadUsers = useRef(
        debounce((searchText: string) => {
            loadUserOptions(searchText);
        }, 1000),
    ).current;

    const assignRoleToUser = async (data: AssignRoleForm) => {
        await addUserToGroup({ user_id: data.user?.external_id, group: data.group });
        dispatch(
            openNotification({
                severity: 'success',
                text: `You have successfully added ${data.user?.last_name}, ${data.user?.first_name} to the group ${data.group}`,
            }),
        );
    };

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== 409) {
            return;
        }
        setBackendError(error.response?.data.message || '');
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
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while assigning role to a user' }));
        }
    };

    return (
        <Modal open={assignRoleModalOpen} onClose={handleClose} keepMounted={false}>
            <Paper sx={{ ...modalStyle }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12}>
                                <MetHeader3 bold>Assign a Role</MetHeader3>
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
                                        Select the user you want to assign a role
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
