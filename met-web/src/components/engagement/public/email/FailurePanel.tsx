import React from 'react';
import { Grid2 as Grid, Stack } from '@mui/material';
import { FailurePanelProps } from './types';
import { modalStyle } from 'components/common';
import { Button } from 'components/common/Input';
import { Header1 as MetHeader1Old, BodyText as MetBodyOld } from 'components/common/Typography';
import { When } from 'react-if';

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
                <MetHeader1Old weight="bold">We are sorry</MetHeader1Old>
            </Grid>
            <Grid size={12}>
                <MetBodyOld>There was a problem with the email address you provided:</MetBodyOld>
            </Grid>

            <Grid size={12}>
                <MetBodyOld>{email}</MetBodyOld>
            </Grid>
            <When condition={isInternal}>
                <Grid size={12}>
                    <MetBodyOld>
                        <strong>This is an internal engagement.</strong> Make sure you are using a government email.
                    </MetBodyOld>
                </Grid>
            </When>
            <Grid size={12}>
                <MetBodyOld>Please verify your email and try again.</MetBodyOld>
            </Grid>
            <Grid size={12}>
                <MetBodyOld>If this problem persists, contact sample@gmail.com</MetBodyOld>
            </Grid>
            <Grid container size={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <Button variant="secondary" onClick={handleClose}>
                        Go back to Engagement
                    </Button>
                    <Button variant="primary" onClick={tryAgain}>
                        Try Again
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FailurePanel;
