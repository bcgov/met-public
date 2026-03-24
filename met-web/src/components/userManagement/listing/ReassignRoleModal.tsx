import React, { useContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import { FormControl, FormControlLabel, FormLabel, Grid2 as Grid, Paper, Radio, Stack } from '@mui/material';
import { modalStyle } from 'components/common';
import { Button } from 'components/common/Input/Button';
import { BodyText, Header3 } from 'components/common/Typography';
import { UserManagementContext } from './UserManagementContext';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { USER_COMPOSITE_ROLE } from 'models/user';
import { Unless } from 'react-if';
import { Palette } from 'styles/Theme';
import { changeUserRole } from 'services/userService/api';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const schema = yup
    .object({
        role: yup.string().required('Please select a role to assign to this user').required(),
    })
    .required();

type AssignRoleForm = yup.TypeOf<typeof schema>;

export const ReassignRoleModal = () => {
    const { reassignRoleModalOpen, setReassignRoleModalOpen, user, loadUserListing } =
        useContext(UserManagementContext);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useAppDispatch();

    const methods = useForm<AssignRoleForm>({
        resolver: yupResolver(schema) as unknown as Resolver<AssignRoleForm>,
    });

    const { reset, handleSubmit } = methods;

    const handleClose = () => {
        setReassignRoleModalOpen(false);
        reset({});
    };

    const onSubmit = async (data: AssignRoleForm) => {
        try {
            const { role } = await schema.validate(data);
            setIsSaving(true);
            await changeUserRole({ user_id: user.id, role });
            handleClose();
            loadUserListing();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have reassigned ${user.first_name} ${user.last_name} as ${role}.`,
                }),
            );
            setIsSaving(false);
        } catch {
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
                            <Grid size={12} mb={2}>
                                <Header3 weight="bold">
                                    Reassign Role for {user?.first_name + ' ' + user?.last_name}
                                </Header3>
                            </Grid>
                        </Grid>

                        <Grid
                            size={12}
                            container
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            rowSpacing={4}
                        >
                            <Grid size={12}>
                                <FormControl>
                                    <FormLabel
                                        id="controlled-radio-buttons-group"
                                        sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
                                    >
                                        What role would you like to reassign to this user?
                                    </FormLabel>
                                    <ControlledRadioGroup name="role">
                                        <Unless condition={user.main_role === USER_COMPOSITE_ROLE.VIEWER.label}>
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.VIEWER.value}
                                                control={<Radio />}
                                                label={'Viewer'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_role === USER_COMPOSITE_ROLE.REVIEWER.label}>
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.REVIEWER.value}
                                                control={<Radio />}
                                                label={'Reviewer'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_role === USER_COMPOSITE_ROLE.TEAM_MEMBER.label}>
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.TEAM_MEMBER.value}
                                                control={<Radio />}
                                                label={'Team Member'}
                                            />
                                        </Unless>
                                        <Unless condition={user.main_role === USER_COMPOSITE_ROLE.ADMIN.label}>
                                            <FormControlLabel
                                                value={USER_COMPOSITE_ROLE.ADMIN.value}
                                                control={<Radio />}
                                                label={'Administrator'}
                                            />
                                        </Unless>
                                    </ControlledRadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <BodyText>
                                    Reassigning a user role will change their role for all active engagements. Any
                                    assigned engagements will have to be reassigned after changing this user's role.
                                </BodyText>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            size={12}
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
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button loading={isSaving} type="submit" variant="primary">
                                    Submit
                                </Button>
                            </Stack>
                        </Grid>
                    </form>
                </FormProvider>
            </Paper>
        </Modal>
    );
};
