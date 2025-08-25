import React, { useEffect, useState } from 'react';
import { Grid, Skeleton, Paper, ThemeProvider } from '@mui/material';
import { Widget } from 'models/widget';
import { Event, EVENT_TYPE } from 'models/event';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Switch, Case } from 'react-if';
import { getEvents } from 'services/widgetService/EventService';
import VirtualSession from './VirtualSession';
import InPersonEvent from './InPersonEvent';
import { Header2, BodyText } from 'components/common/Typography';
import { BaseTheme } from 'styles/Theme';

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
            <Grid item container justifyContent="flex-start" flexDirection={'column'} xs={12} paddingBottom={0}>
                <Header2 mb={0} pb={0}>
                    <Skeleton variant="rectangular" sx={{ width: '90%' }} />
                </Header2>
                <BodyText m="1rem 0 1.5rem;">
                    <Skeleton variant="text" sx={{ width: '80%' }} />
                </BodyText>
                <ThemeProvider theme={BaseTheme}>
                    <Paper elevation={1} sx={{ padding: '1em' }}>
                        <Grid container justifyContent="flex-start" spacing={3}>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height="3em" />
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height="1.5em" />
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height="1.5em" />
                            </Grid>
                        </Grid>
                    </Paper>
                </ThemeProvider>
            </Grid>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <Grid item container justifyContent="flex-start" flexDirection={'column'} xs={12} paddingBottom={0}>
            {events.map((event: Event) => {
                const eventItem = event.event_items[0];
                return (
                    <>
                        <Header2 mb={0} pb={0}>
                            {eventItem.event_name}
                        </Header2>
                        <BodyText m="1rem 0 1.5rem;">{eventItem.description}</BodyText>
                        <ThemeProvider key={event.id} theme={BaseTheme}>
                            <Paper elevation={1} sx={{ minHeight: '12em', p: '2em', mb: '2.5rem' }}>
                                <Grid
                                    container
                                    columnSpacing={1}
                                    rowSpacing={1}
                                    margin={0}
                                    xs={12}
                                    lineHeight="2.25rem"
                                >
                                    <Switch>
                                        <Case condition={event.type === EVENT_TYPE.VIRTUAL}>
                                            <VirtualSession eventItem={eventItem} />
                                        </Case>
                                        <Case
                                            condition={
                                                event.type === EVENT_TYPE.OPENHOUSE || event.type === EVENT_TYPE.MEETUP
                                            }
                                        >
                                            <InPersonEvent eventItem={eventItem} />
                                        </Case>
                                    </Switch>
                                </Grid>
                            </Paper>
                        </ThemeProvider>
                    </>
                );
            })}
        </Grid>
    );
};

export default EventsWidget;
