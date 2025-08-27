import React, { Suspense } from 'react';
import { Grid, Skeleton, Paper, ThemeProvider, Box } from '@mui/material';
import { Widget } from 'models/widget';
import { TimelineWidget, TimelineEvent as TimelineEventType, EventStatus } from 'models/timelineWidget';
import { fetchTimelineWidgets } from 'services/widgetService/TimelineService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseTheme } from 'styles/Theme';
import { BodyText, Header3 } from 'components/common/Typography';
import { Await } from 'react-router-dom';
import { faCircle, faCircleHalf } from '@fortawesome/pro-solid-svg-icons';
interface TimelineWidgetProps {
    widget: Widget;
}

const TimelineWidgetView = ({ widget }: TimelineWidgetProps) => {
    const timeline = fetchTimelineWidgets(widget.id);

    return (
        <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
            <Await resolve={timeline}>
                {(timelineWidgets: TimelineWidget[]) => {
                    const timelineWidget = timelineWidgets[0];
                    return (
                        <Grid container gap="1rem">
                            <Grid item xs={12} mt="4rem">
                                <Header3 sx={{ fontSize: '1.375rem' }} weight="thin">
                                    {timelineWidget.title}
                                </Header3>
                            </Grid>
                            <Grid item xs={12}>
                                <BodyText>{timelineWidget.description}</BodyText>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                component={Paper}
                                sx={{
                                    mt: '1.5rem',
                                    bgcolor: 'white',
                                    padding: '2em',
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'blue.90',
                                    height: 'fit-content',
                                }}
                            >
                                <ThemeProvider theme={BaseTheme}>
                                    {timelineWidget.events.map((event, index) => (
                                        <Grid container item xs={12} key={event.id} direction="row">
                                            <TimelineEvent
                                                event={event}
                                                isLast={index === timelineWidget.events.length - 1}
                                            />
                                        </Grid>
                                    ))}
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    );
                }}
            </Await>
        </Suspense>
    );
};

export default TimelineWidgetView;

const TimelineEvent = ({ event, isLast }: { event: TimelineEventType; isLast: boolean }) => {
    return (
        <Grid container direction="row" gap={2} alignItems="stretch" justifyContent="flex-start">
            {/* Left side with icon and line */}
            <Grid item container alignItems="stretch" direction="column" sx={{ width: '3rem' }}>
                {/* Event Icon */}
                <Grid item>
                    <Paper
                        sx={{
                            height: '1.5em',
                            width: '1.5em',
                            borderRadius: '50%',
                            border: '1px solid',
                            borderColor: 'blue.90',
                            fontSize: '32px',
                            padding: '8px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            color: 'blue.90',
                        }}
                    >
                        {event.status === EventStatus.Completed && <FontAwesomeIcon icon={faCircle} />}
                        {event.status === EventStatus.InProgress && (
                            <FontAwesomeIcon rotation={270} icon={faCircleHalf} />
                        )}
                    </Paper>
                </Grid>
                {/* Dividing line */}
                {!isLast && (
                    <Grid item xs alignItems="center" direction="column">
                        <Box
                            sx={{
                                height: 'calc(100% + 2em)',
                                width: 'calc(50% + 2px)',
                                borderRight: '4px solid',
                                borderColor: 'blue.90',
                            }}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Right side with event content */}
            <Grid item xs pb={isLast ? '0' : '2em'} minHeight={isLast ? '0' : '6em'}>
                <BodyText size="large" bold>
                    {event.description} ({['Pending', 'In Progress', 'Completed'][event.status - 1]})
                </BodyText>
                <BodyText>{event.time}</BodyText>
            </Grid>
        </Grid>
    );
};
