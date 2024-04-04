import React, { useContext, useState, useMemo, useRef } from 'react';
import Modal from '@mui/material/Modal';
import { Autocomplete, CircularProgress, Grid, Paper, Stack, TextField, useTheme } from '@mui/material';
import { MetHeader3, MetLabel, MetSmallText, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User } from 'models/user';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUserList } from 'services/userService/api';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { addTeamMemberToEngagement } from 'services/membershipService';
import { debounce } from 'lodash';
import axios, { AxiosError } from 'axios';
import { When } from 'react-if';

const schema = yup
    .object({
        user: yup.object().nullable().required('A user must be selected'),
    })
    .required();

type AddTeamMemberForm = yup.TypeOf<typeof schema>;

export const AddTeamMemberModal = () => {
    const dispatch = useAppDispatch();
    const { addTeamMemberOpen, setAddTeamMemberOpen, teamMembers, loadTeamMembers } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const [isAdding, setIsAdding] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [backendError, setBackendError] = useState('');

    const theme = useTheme();

    const teamMembersIds = useMemo(() => teamMembers.map((teamMember) => teamMember.user_id), [teamMembers]);

    const methods = useForm<AddTeamMemberForm>({
        resolver: yupResolver(schema),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = methods;

    const { user: userErrors } = errors;

    const handleClose = () => {
        setAddTeamMemberOpen(false);
        reset({});
    };

    const loadUsers = async (searchText: string) => {
        if (searchText.length < 3) {
            return;
        }
        try {
            setUsersLoading(true);
            const response = await getUserList({
                search_text: searchText,
                include_roles: false,
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

    const debounceLoadUsers = useRef(
        debounce((searchText: string) => {
            loadUsers(searchText);
        }, 1000),
    ).current;

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== 409) {
            return;
        }
        setBackendError(error.response?.data.message || '');
    };

    const onSubmit: SubmitHandler<AddTeamMemberForm> = async (data: AddTeamMemberForm) => {
        try {
            setIsAdding(true);
            await addTeamMemberToEngagement({
                user_id: data.user?.external_id,
                engagement_id: savedEngagement.id,
            });
            setIsAdding(false);
            loadTeamMembers();
            handleClose();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully added ${data.user?.username} as a Team Member on ${savedEngagement.name}.`,
                }),
            );
        } catch (error) {
            setIsAdding(false);
            if (axios.isAxiosError(error)) {
                setErrors(error);
            }
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add user' }));
        }
    };

    return (
        <Modal open={addTeamMemberOpen} onClose={handleClose} keepMounted={false}>
            <Paper sx={{ ...modalStyle }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
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
                                    <MetHeader3 bold>Add a Team Member to this Engagement</MetHeader3>
                                </Grid>
                                <Grid item xs={12}>
                                    <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                        Select the Team Member you want to add
                                    </MetLabel>

                                    <Controller
                                        control={control}
                                        name="user"
                                        render={({ field: { ref, onChange, ...field } }) => (
                                            <Autocomplete
                                                options={users || []}
                                                data-testid="select-team-member"
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
                                                getOptionDisabled={(user: User) => teamMembersIds.includes(user.id)}
                                                loading={usersLoading}
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
                                    <PrimaryButton loading={isAdding} type="submit">
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
