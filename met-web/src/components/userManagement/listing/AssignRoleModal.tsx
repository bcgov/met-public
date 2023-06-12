import React, { useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Paper,
    Radio,
    Stack,
    useTheme,
} from '@mui/material';
import { MetHeader3, MetSmallText, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { USER_GROUP } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToGroup } from 'services/userService/api';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import axios, { AxiosError } from 'axios';

const schema = yup
    .object({
        group: yup.string().required('A role must be specified'),
    })
    .required();

type AssignRoleForm = yup.TypeOf<typeof schema>;

export const AssignRoleModal = () => {
    const dispatch = useAppDispatch();
    const { assignRoleModalOpen, setassignRoleModalOpen, user, loadUserListing } = useContext(UserManagementContext);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [backendError, setBackendError] = useState('');
    const theme = useTheme();

    const methods = useForm<AssignRoleForm>({
        resolver: yupResolver(schema),
    });

    const {
        handleSubmit,
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

    const { group: groupErrors } = errors;

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

    const assignRoleToUser = async (data: AssignRoleForm) => {
        await addUserToGroup({ user_id: user?.external_id, group: data.group });
        dispatch(
            openNotification({
                severity: 'success',
                text: `You have successfully added ${user?.last_name}, ${user?.first_name} to the group ${data.group}`,
            }),
        );
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
                                <MetHeader3 bold>
                                    Assign Role to {user.last_name}, {user.first_name}
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
                                    <FormControl error={Boolean(errors['group'])}>
                                        <FormLabel
                                            id="controlled-radio-buttons-group"
                                            sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
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
