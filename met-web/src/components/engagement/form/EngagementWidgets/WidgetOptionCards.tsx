import React from 'react';
import { Divider, Grid } from '@mui/material';
import WhoIsListeningOptionCard from './WhoIsListeningOptionCard';
import { MetHeader4 } from 'components/common';

const WidgetOptionCards = () => {
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader4 bold>Select Widget</MetHeader4>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid container item xs={12} lg={6}>
                <Grid item xs={12}>
                    <WhoIsListeningOptionCard />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
