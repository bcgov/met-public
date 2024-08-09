import React from 'react';
import { Grid, Stack } from '@mui/material';
import { FailurePanelProps } from './types';
import { modalStyle, PrimaryButtonOld, SecondaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';
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
            <Grid item xs={12}>
                <MetHeader1Old bold>We are sorry</MetHeader1Old>
            </Grid>
            <Grid item xs={12}>
                <MetBodyOld>There was a problem with the email address you provided:</MetBodyOld>
            </Grid>

            <Grid item xs={12}>
                <MetBodyOld>{email}</MetBodyOld>
            </Grid>
            <When condition={isInternal}>
                <Grid item xs={12}>
                    <MetBodyOld>
                        <strong>This is an internal engagement.</strong> Make sure you are using a government email.
                    </MetBodyOld>
                </Grid>
            </When>
            <Grid item xs={12}>
                <MetBodyOld>Please verify your email and try again.</MetBodyOld>
            </Grid>
            <Grid item xs={12}>
                <MetBodyOld>If this problem persists, contact sample@gmail.com</MetBodyOld>
            </Grid>
            <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <SecondaryButtonOld onClick={handleClose}>Go back to Engagement</SecondaryButtonOld>
                    <PrimaryButtonOld onClick={tryAgain}>Try Again</PrimaryButtonOld>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FailurePanel;
