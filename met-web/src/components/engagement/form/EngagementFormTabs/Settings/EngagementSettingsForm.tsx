import React, { useContext } from 'react';
import { Divider, Grid } from '@mui/material';
import { MetPaper, PrimaryButton } from 'components/common';
import InternalEngagement from './InternalEngagement';
import SendReport from './SendReport';
import { EngagementSettingsContext } from './EngagementSettingsContext';
import { PublicUrls } from './PublicUrls';

const EngagementSettingsForm = () => {
    const { handleSaveSettings, updatingSettings } = useContext(EngagementSettingsContext);

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                sx={{ padding: '2em' }}
            >
                <Grid item xs={12}>
                    <InternalEngagement />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <SendReport />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <ConsentMessage />
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton loading={updatingSettings} onClick={handleSaveSettings}>
                        Save
                    </PrimaryButton>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <PublicUrls />
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettingsForm;
