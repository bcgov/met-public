import React from 'react';
import { Divider, Grid } from '@mui/material';
import WhoIsListeningOptionCard from './WhoIsListening/WhoIsListeningOptionCard';
import { MetHeader3 } from 'components/common';
import DocumentOptionCard from './Documents/DocumentOptionCard';
import SubscribeOptionCard from './Subscribe/SubscribeOptionCard';
import EventsOptionCard from './Events/EventsOptionCard';
import MapOptionCard from './Map/MapOptionCard';
import VideoOptionCard from './Video/VideoOptionCard';
import TimelineOptionCard from './Timeline/TimelineOptionCard';
import PollOptionCard from './Poll/PollOptionCard';
import ImageOptionCard from './Image/ImageOptionCard';

const WidgetOptionCards = () => {
    return (
        <Grid item xs={12} container alignItems="stretch" justifyContent={'flex-start'} spacing={3}>
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
                <SubscribeOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EventsOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <MapOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <VideoOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <TimelineOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <PollOptionCard />
            </Grid>
            <Grid item xs={12} lg={6}>
                <ImageOptionCard />
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
