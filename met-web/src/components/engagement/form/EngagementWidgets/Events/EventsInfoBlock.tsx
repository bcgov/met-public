import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { EventsContext } from './EventsContext';
import { Event, EVENT_TYPE } from 'models/event';
import EventInfoPaper from './EventInfoPaper';
import VirtualEventInfoPaper from './VirtualEventInfoPaper';
import { When } from 'react-if';

const EventsInfoBlock = () => {
    const { events, isLoadingEvents } = useContext(EventsContext);

    if (isLoadingEvents) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="12em" />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
            {events.map((event: Event, index) => {
                return (
                    <Grid item xs={12} key={`Grid-${event.id}`}>
                        <When condition={event.type === EVENT_TYPE.MEETING}>
                            <EventInfoPaper event={event} />
                        </When>
                        <When condition={event.type === EVENT_TYPE.OPENHOUSE}>
                            <EventInfoPaper event={event} />
                        </When>
                        <When condition={event.type === EVENT_TYPE.VIRTUAL}>
                            <VirtualEventInfoPaper event={event} />
                        </When>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default EventsInfoBlock;
