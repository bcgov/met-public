import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetBody } from 'components/common';
import { Grid, Link, Skeleton, useTheme, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { Event, EVENT_TYPE } from 'models/event';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { When } from 'react-if';
import { getEvents } from 'services/widgetService/EventService';
import { formatDate } from 'components/common/dateHelper';

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
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid
                item
                container
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                flexDirection={'column'}
                xs={12}
                paddingBottom={1}
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
                        columnSpacing={3}
                        rowSpacing={1}
                        xs={12}
                        paddingTop={2}
                        paddingBottom={4}
                    >
                        <Grid
                            item
                            container
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            alignItems="flex-start"
                            direction="row"
                            rowSpacing={1}
                            xs={12}
                            md={9}
                        >
                            <When condition={event.type === EVENT_TYPE.MEETUP.value}>
                                <Grid
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    paddingBottom={1}
                                    item
                                    xs={12}
                                >
                                    <MetBody>
                                        OPEN HOUSE - Come to this Open House to hear about this project from the
                                        proponent. Information session will be folloewd by a question period.
                                    </MetBody>
                                </Grid>
                            </When>
                            <When condition={event.type === EVENT_TYPE.OPENHOUSE.value}>
                                <Grid
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    paddingBottom={1}
                                    item
                                    xs={12}
                                >
                                    <MetBody>
                                        MEETUP - Come to this Meetup to hear about this project from the proponent.
                                        Information session will be folloewd by a question period.
                                    </MetBody>
                                </Grid>
                            </When>
                            <When condition={event.type === EVENT_TYPE.VIRTUAL.value}>
                                <Grid
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    paddingBottom={1}
                                    item
                                    xs={12}
                                >
                                    <MetBody>
                                        Virtual Session - Attend this session to learn more and ask questions.
                                    </MetBody>
                                </Grid>
                            </When>
                            <When
                                condition={
                                    event.type === EVENT_TYPE.MEETUP.value || event.type === EVENT_TYPE.OPENHOUSE.value
                                }
                            >
                                <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                    <MetBody>Location: {eventItem.location_name}</MetBody>
                                </Grid>
                                <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                    <MetBody>Address: {eventItem.location_address}</MetBody>
                                </Grid>
                            </When>
                            <Grid item container justifyContent={{ xs: 'center', md: 'flex-start' }} xs={12}>
                                <MetBody>Date: {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBody>
                            </Grid>
                            <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                <MetBody>
                                    Time:{' '}
                                    {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                                        eventItem.end_date,
                                        'h:mm a',
                                    )} PST`}
                                </MetBody>
                            </Grid>
                            <When condition={event.type === EVENT_TYPE.VIRTUAL.value}>
                                <Grid
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    item
                                    xs={12}
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    <Link href={`${eventItem.url}`}>{eventItem.url_label}</Link>
                                </Grid>
                            </When>
                        </Grid>
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default EventsWidget;
