import React from 'react';
import { Grid2 as Grid, Typography } from '@mui/material';
import { modalStyle } from 'components/common';
import { Button } from 'components/common/Input';
import { BodyText, Header1 } from 'components/common/Typography';
import { ThankYouPanelProps } from 'engagements/public/email/types';
import { useAsyncValue } from 'react-router-dom';
import { Engagement } from 'models/engagement';
const ThankYouPanel = ({ handleClose }: ThankYouPanelProps) => {
    const savedEngagement = (useAsyncValue() as [Engagement] | undefined)?.[0];
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...modalStyle }}
            rowSpacing={2}
        >
            <Grid container size={12}>
                <Grid size={12}>
                    <Header1 weight="bold" sx={{ mb: 2 }}>
                        Thank you
                    </Header1>
                </Grid>
                <Grid size={12}>
                    <Typography id="modal-modal-header"></Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" size={12}>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1 }}>Your submission was successful.</BodyText>
                </Grid>
                <Grid size={12}>
                    <BodyText sx={{ mb: 1 }}>
                        We appreciate you take the time to voice your opinion about{' '}
                        {savedEngagement?.name || 'this engagement'}. When the engagement period is over
                        {savedEngagement?.end_date ? ` (on ${savedEngagement.end_date})` : ''}, you will receive a link
                        to access the full survey report and view all the comments we received.
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
                    <Button variant="primary" onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ThankYouPanel;
