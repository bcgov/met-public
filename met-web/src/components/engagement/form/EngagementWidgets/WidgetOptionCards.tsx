import React from 'react';
import { Divider, Grid } from '@mui/material';
import WhoIsListeningOptionCard from './WhoIsListening/WhoIsListeningOptionCard';
import { MetHeader3 } from 'components/common';
import DocumentOptionCard from './Documents/DocumentOptionCard';
import PhasesOptionCard from './Phases/PhasesOptionCard';
import SubscribeOptionCard from './Subscribe/SubscribeOptionCard';

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
                <DocumentOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <PhasesOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <SubscribeOptionCard />
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
