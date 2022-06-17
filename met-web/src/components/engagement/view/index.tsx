import React from 'react';
import { Grid } from '@mui/material';
import { EngagementBanner } from './EngagementBanner';
import { ActionProvider } from './ActionContext';
import { EngagementContent } from './EngagementContent';

const Engagement = () => {
    return (
        <ActionProvider>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <EngagementBanner />
                </Grid>
                <Grid item xs={12}>
                    <EngagementContent />
                </Grid>
            </Grid>
        </ActionProvider>
    );
};

export default Engagement;
