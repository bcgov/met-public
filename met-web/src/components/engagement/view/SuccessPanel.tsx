import React from 'react';
import { Grid } from '@mui/material';
import { SuccessPanelProps } from './types';
import { modalStyle, PrimaryButton, MetHeader1, MetBody } from 'components/common';

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
                    <MetHeader1 bold sx={{ mb: 2 }}>
                        Thank you
                    </MetHeader1>
                </Grid>
                <Grid item xs={12}>
                    <MetBody id="modal-modal-header">
                        We sent a link to provide your feedback at the following email address:
                    </MetBody>
                    <MetBody sx={{ mt: 1 }}>{email}</MetBody>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>
                        If you don't see the email in your inbox within a few minutes, please check your junk/spam
                        folder, or your promotion folder (Gmail).
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>
                        Please click the link provided to provide your feedback.
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>The link will be valid for 24 hours.</MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1, fontWeight: 'bold', fontStyle: 'italic' }}>
                        If you are not able to provide feedback within 24 hours, you may request a new link. Refer to
                        the verification email for more information.
                    </MetBody>
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
                    <PrimaryButton onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuccessPanel;
