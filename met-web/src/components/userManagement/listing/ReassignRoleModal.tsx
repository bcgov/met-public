import React, { useContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import { FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, Stack } from '@mui/material';
import { MetDescription, MetHeader3, PrimaryButton, SecondaryButton, modalStyle } from 'components/common';
import { UserManagementContext } from './UserManagementContext';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { USER_GROUP } from 'models/user';
import { Unless } from 'react-if';
import { Palette } from 'styles/Theme';
import { changeUserGroup } from 'services/userService/api';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const schema = yup
    .object({
        group: yup.string().required('Please select a role to assign to this user').required(),
    })
    .required();

type AssignRoleForm = yup.TypeOf<typeof schema>;

export const ReassignRoleModal = () => {
    const { reassignRoleModalOpen, setReassignRoleModalOpen, user, loadUserListing } =
        useContext(UserManagementContext);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useAppDispatch();

    const methods = useForm<AssignRoleForm>({
        resolver: yupResolver(schema),
    });

    const { reset, handleSubmit } = methods;

    const handleClose = () => {
        setReassignRoleModalOpen(false);
        reset({});
    };

    const onSubmit = async (data: AssignRoleForm) => {
        try {
            const { group } = await schema.validate(data);
            setIsSaving(true);
            await changeUserGroup({ user_id: user.id, group });
            handleClose();
            loadUserListing();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have reassigned ${user.first_name} ${user.last_name} as ${group}.`,
                }),
            );
            setIsSaving(false);
        } catch (err) {
            setIsSaving(false);
            dispatch(openNotification({ text: 'An error occurred while reassiging role', severity: 'error' }));
        }
    };

    return (
        <Modal open={reassignRoleModalOpen} onClose={handleClose} keepMounted={false}>
            <Paper sx={{ ...modalStyle }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12} mb={2}>
                                <MetHeader3 bold>
                                    Reassign Role for {user?.first_name + ' ' + user?.last_name}
                                </MetHeader3>
                            </Grid>
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
                                <FormControl>
                                    <FormLabel
                                        id="controlled-radio-buttons-group"
                                        sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
                                    >
                                        What role would you like to reassign to this user?
                                    </FormLabel>
                                    <ControlledRadioGroup name="group">
                                        <Unless condition={user.main_group === USER_GROUP.VIEWER.label}>
                                            <FormControlLabel
                                                value={USER_GROUP.VIEWER.value}
                                                control={<Radio />}
                                                label={'Viewer'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_group === USER_GROUP.REVIEWER.label}>
                                            <FormControlLabel
                                                value={USER_GROUP.REVIEWER.value}
                                                control={<Radio />}
                                                label={'Reviewer'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_group === USER_GROUP.TEAM_MEMBER.label}>
                                            <FormControlLabel
                                                value={USER_GROUP.TEAM_MEMBER.value}
                                                control={<Radio />}
                                                label={'Team Member'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_group === USER_GROUP.ADMIN.label}>
                                            <FormControlLabel
                                                value={USER_GROUP.ADMIN.value}
                                                control={<Radio />}
                                                label={'Administrator'}
                                            />
                                        </Unless>
                                    </ControlledRadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <MetDescription>
                                    Reassigning a user role will change their role for all active engagements. Any
                                    assigned engagements will have to be reassigned after changing this user's role.
                                </MetDescription>
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
                                <PrimaryButton loading={isSaving} type="submit">
                                    Submit
                                </PrimaryButton>
                            </Stack>
                        </Grid>
                    </form>
                </FormProvider>
            </Paper>
        </Modal>
    );
};
