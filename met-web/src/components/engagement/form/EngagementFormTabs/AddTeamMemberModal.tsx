import React, { useContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Autocomplete, Grid, Paper, Stack, TextField } from '@mui/material';
import { MetHeader3, MetLabel, MetParagraph, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User, USER_GROUP } from 'models/user';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addUserToGroup } from 'services/userService/api';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { EngagementTabsContext } from './EngagementTabsContext';
import { Unless, When } from 'react-if';
import { ActionContext } from '../ActionContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

const schema = yup
    .object({
        user: yup.object().required('A user must be selected'),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddTeamMemberModal = () => {
    const dispatch = useAppDispatch();
    const { addTeamMemberOpen, setAddTeamMemberOpen, users } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const [isAdding, setIsAdding] = useState(false);
    const [isAddSuccess, setIsAddSuccess] = useState(false);

    const methods = useForm<AddUserForm>({
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
        setIsAddSuccess(false);
        reset({});
    };

    const onSubmit: SubmitHandler<AddUserForm> = async (data: AddUserForm) => {
        try {
            setIsAdding(true);
            await addUserToGroup({
                user_id: data.user?.external_id,
                group: USER_GROUP.VIEWER.value,
                engagement_id: savedEngagement.id,
            });
            dispatch(openNotification({ severity: 'success', text: 'User has been successfully added' }));
            setIsAdding(false);
            setIsAddSuccess(true);
            handleClose();
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: 'Add a Team member to this engagement',
                        subText: [
                            {
                                text: `You have successfully added <user name> as an Team Member on <engagement name>.`,
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add user' }));
            setIsAddSuccess(false);
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
                                                options={users || []}
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
