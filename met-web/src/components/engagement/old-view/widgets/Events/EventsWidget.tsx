import React, { useEffect, useState } from 'react';
import { colors, MetDescription } from 'components/common';
import { Grid, Paper, Skeleton, ThemeProvider, useTheme } from '@mui/material';
import { Widget } from 'models/widget';
import { Event, EVENT_TYPE } from 'models/event';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Switch, Case } from 'react-if';
import { getEvents } from 'services/widgetService/EventService';
import VirtualSession from './VirtualSession';
import InPersonEvent from './InPersonEvent';
import { Header2 } from 'components/common/Typography';
import { BaseTheme, Palette } from 'styles/Theme';

interface EventsWidgetProps {
    widget: Widget;
}
const EventsWidget = ({ widget }: EventsWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

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

    // Define styles
    const metPaperStyles = {
        padding: '2em',
        minHeight: '12em',
        backgroundColor: colors.surface.white,
        color: colors.type.regular.primary + ' !important',
        borderRadius: '16px',
        border: isDarkMode ? 'none' : `1px solid ${Palette.primary.main}`,
        marginBottom: '2.5rem',
    };
    const eventHeaderStyles = {
        marginBottom: 0,
        paddingBottom: 0,
        color: isDarkMode ? colors.type.inverted.primary : Palette.text.primary,
    };
    const eventDescriptionStyles = {
        margin: '1rem 0 1.5rem',
        padding: 0,
        color: isDarkMode ? colors.type.inverted.primary : Palette.text.primary,
        fontSize: '16px',
    };

    if (isLoading) {
        return (
            <Grid item container justifyContent="flex-start" flexDirection={'column'} xs={12} paddingBottom={0}>
                <Header2 sx={eventHeaderStyles} style={{ marginBottom: '1rem' }}>
                    <Skeleton variant="rectangular">
                        <span style={{ width: '50%' }}>Loading Events...</span>
                    </Skeleton>
                </Header2>
                <Paper elevation={1} sx={metPaperStyles}>
                    <Grid container justifyContent="flex-start" spacing={3}>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height="10em" />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height="10em" />
                        </Grid>
                    </Grid>
                </Paper>
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
                        <Header2 style={eventHeaderStyles}>{eventItem.event_name}</Header2>
                        <MetDescription style={eventDescriptionStyles}>{eventItem.description}</MetDescription>
                        <Paper elevation={1} sx={metPaperStyles}>
                            <ThemeProvider theme={BaseTheme}>
                                <Grid
                                    key={event.id}
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
                            </ThemeProvider>
                        </Paper>
                    </>
                );
            })}
        </Grid>
    );
};

export default EventsWidget;
