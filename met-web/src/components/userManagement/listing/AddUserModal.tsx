import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import {
    Autocomplete,
    FormControl,
    FormControlLabel,
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
import ControlledRadiGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { addUserToGroup } from 'services/userService/api';

const schema = yup
    .object({
        group: yup.string().required(),
        user: yup
            .object()
            .shape({
                external_id: yup.string().required(),
            })
            .required(),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddUserModel = () => {
    // const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModelOpen, users } = useContext(UserManagementContext);

    const methods = useForm<AddUserForm>({
        resolver: yupResolver(schema),
    });

    const { handleSubmit, control, reset } = methods;

    const handleClose = () => {
        setAddUserModelOpen(false);
        reset({});
    };

    const onSubmit: SubmitHandler<AddUserForm> = async (data: AddUserForm) => {
        addUserToGroup({ user_id: data.user.external_id, group: data.group });
        handleClose();
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
                                                    />
                                                )}
                                                getOptionLabel={(user: User) => `${user.first_name} ${user.last_name}`}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <FormLabel
                                            id="controlled-radio-buttons-group"
                                            sx={{ fontWeight: 'bold', color: Palette.text.primary }}
                                        >
                                            What role would you like to assign to this user?
                                        </FormLabel>
                                        <ControlledRadiGroup name="group">
                                            <FormControlLabel
                                                value={USER_GROUP.ADMIN}
                                                control={<Radio />}
                                                label="Adminstrator"
                                            />
                                            <FormControlLabel
                                                value={USER_GROUP.VIEWER}
                                                control={<Radio />}
                                                label="Team Member"
                                                disabled
                                            />
                                        </ControlledRadiGroup>
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
                                    <PrimaryButton type="submit">Submit</PrimaryButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Paper>
        </Modal>
    );
};
