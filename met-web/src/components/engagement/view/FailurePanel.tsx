import React from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import { FailurePanelProps } from './types';
import { modalStyle, PrimaryButton, SecondaryButton } from 'components/common';

const FailurePanel = ({ email, handleClose, tryAgain }: FailurePanelProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ ...modalStyle }}
            spacing={2}
        >
            <Grid item xs={12}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    We are sorry
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1">There was a problem with the email address you provided:</Typography>
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
                    <SecondaryButton variant="outlined" onClick={handleClose}>
                        Go back to Engagement
                    </SecondaryButton>
                    <PrimaryButton variant="contained" onClick={tryAgain}>
                        Try Again
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FailurePanel;
