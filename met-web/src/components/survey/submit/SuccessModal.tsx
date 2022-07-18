import React from 'react';
import { Grid, Button, Modal, Box, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    borderColor: 'red',
    height: 600,
};

function SuccessModal(props: any) {
    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    height="100%"
                    width="100%"
                    sx={{ ...style }}
                >
                    <Grid item xs={2} sx={{ p: 2 }}>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h2"
                            sx={{ mb: 4, fontWeight: 'bold' }}
                        >
                            Thank you
                        </Typography>
                        <Typography id="modal-modal-header" sx={{ mt: 1, mb: 1 }}>
                            We sent a link to access the survey at the following email address:
                        </Typography>
                        <Box>
                            <Typography>{props.email}</Typography>
                        </Box>
                    </Grid>
                    <Grid container direction="column" item xs={8} height="100%" width="100%" sx={{ mt: 2 }}>
                        <Grid
                            item
                            xs={10}
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            height="100%"
                            width="100%"
                        >
                            <Typography id="modal-modal-title" sx={{ m: 2, fontWeight: 'bold' }}>
                                Please Click the link provided to access the survey.
                            </Typography>
                            <Typography id="modal-modal-title" sx={{ m: 2, fontWeight: 'bold' }}>
                                The link will be valid for 24 hours.
                            </Typography>
                        </Grid>
                        <Grid item container xs={2} justifyContent="flex-end" alignItems="flex-end">
                            <Button variant="contained" onClick={props.handleClose} sx={{ m: 1 }}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
}

export default SuccessModal;
