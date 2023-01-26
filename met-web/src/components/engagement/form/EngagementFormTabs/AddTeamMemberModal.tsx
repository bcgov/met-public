import React, { useContext, useEffect, useMemo, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Autocomplete, Grid, Paper, Stack, TextField } from '@mui/material';
import { MetHeader3, MetLabel, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User, USER_GROUP } from 'models/user';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUserList } from 'services/userService/api';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { EngagementTabsContext } from './EngagementTabsContext';
import { ActionContext } from '../ActionContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { addTeamMemberToEngagement } from 'services/engagementService/TeamMemberService';

const schema = yup
    .object({
        user: yup.object().required('A user must be selected'),
    })
    .required();

type AddTeamMemberForm = yup.TypeOf<typeof schema>;

export const AddTeamMemberModal = () => {
    const dispatch = useAppDispatch();
    const { addTeamMemberOpen, setAddTeamMemberOpen, users, setUsers, teamMembers } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const [isAdding, setIsAdding] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);

    const teamMembersIds = useMemo(() => teamMembers.map((teamMember) => teamMember.user_id), [teamMembers]);

    const availableUsers = useMemo(
        () =>
            users.filter(
                (user) =>
                    user.groups.includes(USER_GROUP.VIEWER.label) && !user.groups.includes(USER_GROUP.ADMIN.label),
            ),
        [users],
    );

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

    useEffect(() => {
        if (users.length === 0) {
            loadUsers();
        }
    }, []);

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const response = await getUserList();
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

    const onSubmit: SubmitHandler<AddTeamMemberForm> = async (data: AddTeamMemberForm) => {
        try {
            setIsAdding(true);
            await addTeamMemberToEngagement({
                user_id: data.user?.external_id,
                engagement_id: savedEngagement.id,
            });
            dispatch(openNotification({ severity: 'success', text: 'User has been successfully added' }));
            setIsAdding(false);
            handleClose();
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: 'Add a Team member to this engagement',
                        subText: [
                            {
                                text: `You have successfully added ${data.user?.username} as a Team Member on ${savedEngagement.name}.`,
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
        } catch (error) {
            console.log(error);
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
                                    <MetHeader3 bold>Add a Team member to this engagement</MetHeader3>
                                </Grid>
                                <Grid item xs={12}>
                                    <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                        Select the user you want to add
                                    </MetLabel>

                                    <Controller
                                        control={control}
                                        name="user"
                                        render={({ field: { ref, onChange, ...field } }) => (
                                            <Autocomplete
                                                options={availableUsers || []}
                                                data-testid="select-team-member"
                                                onChange={(_, data) => {
                                                    onChange(data);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        {...field}
                                                        inputRef={ref}
                                                        fullWidth
                                                        placeholder="(Select one)"
                                                        error={Boolean(userErrors)}
                                                        helperText={String(userErrors?.message || '')}
                                                    />
                                                )}
                                                getOptionLabel={(user: User) => `${user.first_name} ${user.last_name}`}
                                                getOptionDisabled={(user: User) => teamMembersIds.includes(user.id)}
                                                loading={usersLoading}
                                                disabled={usersLoading}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

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
