import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2 } from 'components/common';
import { Grid, Skeleton, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { Event, EVENT_TYPE } from 'models/event';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Switch, Case } from 'react-if';
import { getEvents } from 'services/widgetService/EventService';
import VirtualSession from './VirtualSession';
import InPersonEvent from './InPersonEvent';

interface EventsWidgetProps {
    widget: Widget;
}
const EventsWidget = ({ widget }: EventsWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const events = await getEvents(widget.id);
            setEvents(events);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement widgets information',
                }),
            );
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [widget]);

    if (isLoading) {
        return (
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <MetHeader2>
                            <Skeleton variant="rectangular" />
                        </MetHeader2>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em', minHeight: '12em' }}>
            <Grid
                item
                container
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                flexDirection={'column'}
                xs={12}
                paddingBottom={0}
            >
                <MetHeader2 bold={true}>Events</MetHeader2>
                <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
            </Grid>
            {events.map((event: Event) => {
                const eventItem = event.event_items[0];

                return (
                    <Grid
                        key={event.id}
                        container
                        item
                        columnSpacing={2}
                        rowSpacing={1}
                        xs={12}
                        paddingTop={2}
                        paddingBottom={2}
                    >
                        <Grid
                            item
                            container
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            alignItems="flex-start"
                            direction="row"
                            rowSpacing={1}
                            xs={12}
                        >
                            <Switch>
                                <Case condition={event.type === EVENT_TYPE.VIRTUAL}>
                                    <VirtualSession eventItem={eventItem} />
                                </Case>
                                <Case
                                    condition={event.type === EVENT_TYPE.OPENHOUSE || event.type === EVENT_TYPE.MEETUP}
                                >
                                    <InPersonEvent eventItem={eventItem} />
                                </Case>
                            </Switch>
                        </Grid>
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default EventsWidget;
