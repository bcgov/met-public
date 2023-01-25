import React, { useContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import {
    Autocomplete,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Paper,
    Radio,
    Stack,
    TextField,
} from '@mui/material';
import { MetHeader3, MetLabel, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User, USER_GROUP } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToGroup } from 'services/userService/api';
import { When } from 'react-if';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';

const schema = yup
    .object({
        user: yup.object().required('A user must be selected'),
        group: yup.string().required('A role must be specified'),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddUserModel = () => {
    const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModelOpen, users } = useContext(UserManagementContext);
    const [isAdding, setIsAdding] = useState(false);

    const methods = useForm<AddUserForm>({
        resolver: yupResolver(schema),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = methods;

    const { user: userErrors, group: groupErrors } = errors;

    const handleClose = () => {
        setAddUserModelOpen(false);
        reset({});
    };

    const onSubmit: SubmitHandler<AddUserForm> = async (data: AddUserForm) => {
        try {
            setIsAdding(true);
            await addUserToGroup({ user_id: data.user?.external_id, group: data.group });
            dispatch(openNotification({ severity: 'success', text: 'User has been successfully added' }));
            setIsAdding(false);
            handleClose();
        } catch (error) {
            console.log(error);
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
                                                disabled
                                            />
                                        </ControlledRadioGroup>
                                        <When condition={Boolean(groupErrors)}>
                                            <FormHelperText>{String(groupErrors?.message)}</FormHelperText>
                                        </When>
                                    </FormControl>
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
