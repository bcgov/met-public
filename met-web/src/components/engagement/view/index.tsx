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
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    sx={{ margin: '1em 2em 1em 3em' }}
                    spacing={1}
                >
                    <Grid item xs={8}>
                        <EngagementContent />
                    </Grid>
                </Grid>
            </Grid>
        </ActionProvider>
    );
};

export default Engagement;
