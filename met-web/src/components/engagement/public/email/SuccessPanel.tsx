import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import { SuccessPanelProps } from 'engagements/public/email/types';
import { modalStyle } from 'components/common';
import { Button } from 'components/common/Input';
import { BodyText, Header1 } from 'components/common/Typography';

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
            <Grid container direction="row" size={12}>
                <Grid size={12}>
                    <Header1 weight="bold" sx={{ mb: 2 }}>
                        Thank you
                    </Header1>
                </Grid>
                <Grid size={12}>
                    <BodyText id="modal-modal-header">
                        We sent a link to provide your feedback at the following email address:
                    </BodyText>
                    <BodyText sx={{ mt: 1 }}>{email}</BodyText>
                </Grid>
            </Grid>
            <Grid container direction="row" size={12}>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1, fontWeight: 'bold' }}>
                        If you don't see the email in your inbox within a few minutes, please check your junk/spam
                        folder, or your promotion folder (Gmail).
                    </BodyText>
                </Grid>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1, fontWeight: 'bold' }}>
                        Please click the link provided to provide your feedback.
                    </BodyText>
                </Grid>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1, fontWeight: 'bold' }}>The link will be valid for 24 hours.</BodyText>
                </Grid>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1, fontStyle: 'italic' }}>
                        If you are not able to provide feedback within 24 hours, you may request a new link. Refer to
                        the verification email for more information.
                    </BodyText>
                </Grid>

                <Grid
                    container
                    direction={{ xs: 'column', sm: 'row' }}
                    size={12}
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ mt: '1em' }}
                >
                    <Button onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SuccessPanel;
