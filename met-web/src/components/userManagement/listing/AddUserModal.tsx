import React, { useState, useContext, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import Modal from '@mui/material/Modal';
import { Autocomplete, Box, Grid, Paper, Stack, TextField } from '@mui/material';
import { MetHeader3, MetLabel, modalStyle, PrimaryButton, SecondaryButton } from 'components/common';
import { User } from 'models/user';
import { UserManagementContext } from './UserManagementContext';

export const AddUserModel = () => {
    const dispatch = useAppDispatch();
    const { addUserModalOpen, setAddUserModelOpen, users } = useContext(UserManagementContext);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleClose = () => {
        setAddUserModelOpen(false);
    };

    const handleSubmit = () => {
        setAddUserModelOpen(false);
    };

    return (
        <Modal open={addUserModalOpen} onClose={handleClose}>
            <Paper sx={{ ...modalStyle }}>
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
                            renderInput={(params) => <TextField {...params} fullWidth placeholder="(Select one)" />}
                            size="small"
                            getOptionLabel={(user: User) => `${user.first_name} ${user.last_name}`}
                            onChange={(_e: React.SyntheticEvent<Element, Event>, user: User | null) =>
                                setSelectedUser(user)
                            }
                            disabled={false}
                        />
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
                            <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
};
