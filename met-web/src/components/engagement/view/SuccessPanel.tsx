import React from 'react';
import { Grid } from '@mui/material';
import { SuccessPanelProps } from './types';
import { modalStyle, PrimaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';

const SuccessPanel = ({ email, handleClose }: SuccessPanelProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...modalStyle }}
            rowSpacing={2}
        >
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <MetHeader1Old bold sx={{ mb: 2 }}>
                        Thank you
                    </MetHeader1Old>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld id="modal-modal-header">
                        We sent a link to provide your feedback at the following email address:
                    </MetBodyOld>
                    <MetBodyOld sx={{ mt: 1 }}>{email}</MetBodyOld>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1, fontWeight: 'bold' }}>
                        If you don't see the email in your inbox within a few minutes, please check your junk/spam
                        folder, or your promotion folder (Gmail).
                    </MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1, fontWeight: 'bold' }}>
                        Please click the link provided to provide your feedback.
                    </MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1, fontWeight: 'bold' }}>The link will be valid for 24 hours.</MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1, fontWeight: 'bold', fontStyle: 'italic' }}>
                        If you are not able to provide feedback within 24 hours, you may request a new link. Refer to
                        the verification email for more information.
                    </MetBodyOld>
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
                    <PrimaryButtonOld onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuccessPanel;
