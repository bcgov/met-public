import React from 'react';
import { Divider, Grid } from '@mui/material';
import WhoIsListeningOptionCard from './WhoIsListeningOptionCard';
import DocumentOptionCard from './DocumentOptionCard';
import { MetHeader3 } from 'components/common';
import EmptyOptionCard from './EmptyOptionCard';
const WidgetOptionCards = () => {
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader3>Select Widget</MetHeader3>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <WhoIsListeningOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EmptyOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <DocumentOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EmptyOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EmptyOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EmptyOptionCard />
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
