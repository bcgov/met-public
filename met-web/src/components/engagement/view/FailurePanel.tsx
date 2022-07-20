import React from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import { FailurePanelProps } from './types';

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

function FailurePanel(props: FailurePanelProps) {
    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ ...style }}>
            <Grid item xs={2} sx={{ mt: 4 }}>
                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ pt: 1, fontWeight: 'bold' }}>
                    We are sorry
                </Typography>
                <Typography id="modal-modal-header" sx={{ mt: 1 }}>
                    There was a problem with the email address you provided:
                </Typography>
                <Box sx={{ pt: 1 }}>
                    <Typography>{props.email}</Typography>
                </Box>
            </Grid>
            <Grid container direction="column" item xs={8} height="100%" width="100%" sx={{ mt: 2 }}>
                <Grid item xs={10} justifyContent="flex-start" alignItems="flex-start" height="100%" width="100%">
                    <Typography id="modal-modal-title" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Please verify your email and try again.
                    </Typography>
                    <Typography id="modal-modal-title" sx={{ mt: 2, fontWeight: 'bold' }}>
                        If this problem persists, contact sample@gmail.com
                    </Typography>
                </Grid>
                <Grid item container xs={2} justifyContent="flex-end" alignItems="flex-end">
                    <Button variant="outlined" onClick={props.handleClose} sx={{ m: 1 }}>
                        Go back to Engagement
                    </Button>
                    <Button variant="contained" onClick={props.tryAgain} sx={{ m: 1 }}>
                        Try Again
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default FailurePanel;
