import React, { useState, useContext, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import Modal from '@mui/material/Modal';
import {
    Autocomplete,
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { MetHeader3, MetLabel, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User } from 'models/user';
import { UserManagementContext } from './UserManagementContext';
import { Palette } from 'styles/Theme';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
    .object({
        name: yup.string(),
        group: yup.string(),
    })
    .required();

type AddUserForm = yup.TypeOf<typeof schema>;

export const AddUserModel = () => {
    const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModelOpen, users } = useContext(UserManagementContext);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const methods = useForm<AddUserForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            group: '',
        },
    });

    const { handleSubmit, register } = methods;

    const handleClose = () => {
        setAddUserModelOpen(false);
    };

    const onSubmit: SubmitHandler<AddUserForm> = async (data: AddUserForm) => {
        setAddUserModelOpen(false);
        console.log(data);
    };

    return (
        <Modal open={addUserModalOpen} onClose={handleClose}>
            <Paper sx={{ ...modalStyle }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader3 bold>Add a User</MetHeader3>
                        </Grid>

                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                                Select the user you want to add
                            </MetLabel>

                            <Autocomplete
                                id="engagement-selector"
                                options={users || []}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth placeholder="(Select one)" name="name" />
                                )}
                                size="small"
                                getOptionLabel={(user: User) => `${user.first_name} ${user.last_name}`}
                                disabled={false}
                                {...register('name')}
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
                                <RadioGroup aria-labelledby="controlled-radio-buttons-group" {...register('group')}>
                                    <FormControlLabel value="admin" control={<Radio />} label="Adminstrator" />
                                    <FormControlLabel value="teamMember" control={<Radio />} label="Team Member" />
                                </RadioGroup>
                            </FormControl>
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
            </Paper>
        </Modal>
    );
};
