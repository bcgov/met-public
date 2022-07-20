import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { SuccessPanelProps } from './types';
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
    border: 2,
};

function SuccessPanel(props: SuccessPanelProps) {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="space-between" sx={{ ...style }}>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Thank you
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography id="modal-modal-header">
                        We sent a link to access the survey at the following email address:
                    </Typography>
                    <Typography sx={{ mt: 1 }}>{props.email}</Typography>
                </Grid>
            </Grid>
            <Grid container direction="column" item xs={12}>
                <Grid item xs={8} justifyContent="flex-start" alignItems="flex-start">
                    <Typography id="modal-modal-title" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Please Click the link provided to access the survey.
                    </Typography>
                    <Typography id="modal-modal-title" sx={{ mb: 1, fontWeight: 'bold' }}>
                        The link will be valid for 24 hours.
                    </Typography>
                </Grid>
                <Grid item container xs={4} justifyContent="flex-end" alignItems="flex-end">
                    <Button variant="contained" onClick={props.handleClose} sx={{ m: 1 }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SuccessPanel;
