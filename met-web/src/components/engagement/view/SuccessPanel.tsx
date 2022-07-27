import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { SuccessPanelProps } from './types';
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

const SuccessPanel = ({ email, handleClose }: SuccessPanelProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...style }}
            rowSpacing={2}
        >
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Thank you
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography id="modal-modal-header">
                        We sent a link to access the survey at the following email address:
                    </Typography>
                    <Typography sx={{ mt: 1 }}>{email}</Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                        Please Click the link provided to access the survey.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>The link will be valid for 24 hours.</Typography>
                </Grid>

                <Grid
                    item
                    container
                    direction={{ xs: 'column', sm: 'row' }}
                    xs={12}
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ mt: '1em' }}
                >
                    <Button variant="contained" onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuccessPanel;
