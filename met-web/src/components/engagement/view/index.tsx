import React from 'react';
import { Grid } from '@mui/material';
import { EngagementBanner } from './EngagementBanner';
import { ActionProvider } from './ActionContext';

const Engagement = () => {
    return (
        <ActionProvider>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <EngagementBanner />
                </Grid>
            </Grid>
        </ActionProvider>
    );
};

export default Engagement;
