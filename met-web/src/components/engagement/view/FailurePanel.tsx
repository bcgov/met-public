import React from 'react';
import { Grid, Button, Box, Typography, Stack } from '@mui/material';
import { FailurePanelProps } from './types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '48%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 'min(95vw, 700px)',
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    m: 1,
    overflowY: 'scroll',
};

const FailurePanel = ({ email, handleClose, tryAgain }: FailurePanelProps) => {
    if (true) {
        return (
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{ ...style }}
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        We are sorry
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">
                        There was a problem with the email address you provided:
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography>{email}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Please verify your email and try again.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        If this problem persists, contact sample@gmail.com
                    </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                        <Button variant="outlined" onClick={handleClose}>
                            Go back to Engagement
                        </Button>
                        <Button variant="contained" onClick={tryAgain}>
                            Try Again
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ ...style }}>
            <Grid item xs={2} sx={{ mt: 4 }}>
                <Typography id="modal-modal-title" variant="h4" sx={{ pt: 1, fontWeight: 'bold' }}>
                    We are sorry
                </Typography>
                <Typography id="modal-modal-header" sx={{ mt: 1 }}>
                    There was a problem with the email address you provided:
                </Typography>
                <Box sx={{ pt: 1 }}>
                    <Typography>{email}</Typography>
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
                    <Button variant="outlined" onClick={handleClose} sx={{ m: 1 }}>
                        Go back to Engagement
                    </Button>
                    <Button variant="contained" onClick={tryAgain} sx={{ m: 1 }}>
                        Try Again
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FailurePanel;
