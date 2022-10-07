import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, TextField } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { ActionContext } from '../ActionContext';
import ImageUpload from 'components/imageUpload';

const AddContactDrawer = () => {
    const { addContactDrawerOpen, handleAddContactDrawerOpen } = useContext(ActionContext);
    return (
        <Drawer anchor="right" open={addContactDrawerOpen} onClose={() => handleAddContactDrawerOpen(false)}>
            <Box sx={{ width: '40vw', paddingTop: '7em' }} role="presentation">
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={2}
                    padding="2em"
                >
                    <Grid item xs={12}>
                        <MetHeader3 bold>Add Contact</MetHeader3>
                        <Divider sx={{ marginTop: '1em' }} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Profile Picture</MetLabel>
                        <ImageUpload
                            data-testid="engagement-form/image-upload"
                            handleAddFile={() => {
                                /***/
                            }}
                            savedImageUrl={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={8} container direction="row" spacing={2}>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Name</MetLabel>
                            <TextField
                                id="contact-name"
                                data-testid="contact-form/name"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="name"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Role</MetLabel>
                            <TextField
                                id="contact-role"
                                data-testid="contact-form/role"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="role"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Phone</MetLabel>
                        <TextField
                            id="contact-phone"
                            data-testid="contact-form/phone"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="phone"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Email</MetLabel>
                        <TextField
                            id="contact-email"
                            data-testid="contact-form/email"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="email"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Address</MetLabel>
                        <TextField
                            id="contact-address"
                            data-testid="contact-form/address"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="address"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Bio</MetLabel>
                        <TextField
                            id="contact-bio"
                            data-testid="contact-form/bio"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="bio"
                            size="small"
                            multiline
                            minRows={5}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        direction="row"
                        spacing={1}
                        justifyContent={'flex-start'}
                        marginTop="8em"
                    >
                        <Grid item>
                            <PrimaryButton>{`Save & Close`}</PrimaryButton>
                        </Grid>
                        <Grid item>
                            <SecondaryButton
                                onClick={() => handleAddContactDrawerOpen(false)}
                            >{`Cancel`}</SecondaryButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    );
};

export default AddContactDrawer;
