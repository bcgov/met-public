import React from 'react';
import { Grid2 as Grid, Stack } from '@mui/material';
import { FailurePanelProps } from './types';
import { modalStyle } from 'components/common';
import { BodyText, Header1 } from 'components/common/Typography';
import { When } from 'react-if';
import { Button } from 'components/common/Input/Button';

const FailurePanel = ({ email, handleClose, tryAgain, isInternal }: FailurePanelProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ ...modalStyle }}
            spacing={2}
        >
            <Grid size={12}>
                <Header1 weight="bold">We are sorry</Header1>
            </Grid>
            <Grid size={12}>
                <BodyText>There was a problem with the email address you provided:</BodyText>
            </Grid>

            <Grid size={12}>
                <BodyText>{email}</BodyText>
            </Grid>
            <When condition={isInternal}>
                <Grid size={12}>
                    <BodyText color="error">
                        <strong>This is an internal engagement.</strong> Make sure you are using a government email.
                    </BodyText>
                </Grid>
            </When>
            <Grid size={12}>
                <BodyText>Please verify your email and try again.</BodyText>
            </Grid>
            <Grid size={12}>
                {/* TODO: Populate this with the tenant configuration from the API */}
                <BodyText>If this problem persists, contact sample@gmail.com</BodyText>
            </Grid>
            <Grid size={12} container direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <Button onClick={handleClose}>Go back to Engagement</Button>
                    <Button variant="primary" onClick={tryAgain}>
                        Try Again
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FailurePanel;
