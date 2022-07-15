import React, { useState } from 'react';
import { Grid, Button, Modal, Box, Typography, TextField, Checkbox } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
};

function FailureModal(props: any) {
    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        width="100%"
                    >
                        <Grid item xs={12} sx={{ p: 2 }}>
                            <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h2"
                                sx={{ p: 1, fontWeight: 'bold' }}
                            >
                                Thank you
                            </Typography>
                            <Typography id="modal-modal-header" sx={{ mt: 1 }}>
                                We sent a link to access the survey at the following email address:
                            </Typography>
                            <Box sx={{ p: 1 }}>
                                <Typography>XXXXX@XXXX.com</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ p: 2 }}>
                            <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h2"
                                sx={{ p: 1, fontWeight: 'bold' }}
                            >
                                Please Click the link provided to access the survey.
                            </Typography>
                            <Typography id="modal-modal-header" sx={{ mt: 1 }}>
                                The link will be valid for 24 hours.
                            </Typography>
                            <Grid item xs={12} sx={{ p: 2 }}>
                                <Button variant="outlined" onClick={props.handleClose} sx={{ m: 1 }}>
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}

export default FailureModal;
