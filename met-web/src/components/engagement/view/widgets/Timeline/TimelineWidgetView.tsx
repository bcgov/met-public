import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetParagraph, MetHeader4 } from 'components/common';
import { Grid, Skeleton, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { TimelineWidget, TimelineEvent } from 'models/timelineWidget';
import { fetchTimelineWidgets } from 'services/widgetService/TimelineService';

interface TimelineWidgetProps {
    widget: Widget;
}

const TimelineWidgetView = ({ widget }: TimelineWidgetProps) => {
    const dispatch = useAppDispatch();
    const [timelineWidget, setTimelineWidget] = useState<TimelineWidget>({
        id: 0,
        widget_id: 0,
        engagement_id: 0,
        title: '',
        description: '',
        events: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTimeline = async () => {
        try {
            const timelines = await fetchTimelineWidgets(widget.id);
            const timeline = timelines[timelines.length - 1];
            setTimelineWidget(timeline);
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
        fetchTimeline();
    }, [widget]);

    const handleRenderTimelineEvent = (tEvent: TimelineEvent, index: number) => {
        const containerStylesObject = {
            minHeight: index + 1 == timelineWidget.events.length ? '60px' : '80px',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: index + 1 == timelineWidget.events.length ? '24px' : '22px',
            borderLeft: index + 1 == timelineWidget.events.length ? 'none' : '2px solid grey',
        };
        const circleContainerStylesObject = {
            padding: '2px',
            border: '2px solid grey',
            marginLeft: '-25px',
            display: 'inline-flex',
            backgroundColor: '#fff',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
        };
        const circleStylesObject = {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            content: '""',
            border: 2 == tEvent.status || 3 == tEvent.status ? '20px solid' : 'none',
            borderColor: 3 == tEvent.status ? '#2e8540' : '#036',
        };
        const checkmarkStylesObject = {
            marginLeft: '-12px',
            marginTop: '-23px',
            fontSize: '31px',
            color: '#fff',
        };
        return (
            <Grid item xs={12} sx={containerStylesObject} key={'event' + (index + 1)}>
                <Grid item sx={circleContainerStylesObject}>
                    <Grid item sx={circleStylesObject}>
                        {3 == tEvent.status && (
                            <Grid sx={checkmarkStylesObject} item>
                                ✓
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item sx={{ paddingLeft: '10px' }}>
                    <MetHeader4 bold>{tEvent.description}</MetHeader4>
                    <MetParagraph style={{ paddingBottom: index + 1 == timelineWidget.events.length ? '0' : '20px' }}>
                        {tEvent.time}
                    </MetParagraph>
                </Grid>
            </Grid>
        );
    };

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
                        <Skeleton variant="rectangular" height="20em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (!timelineWidget) {
        return null;
    }

    return (
        <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em' }}>
            <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
                <Grid
                    item
                    container
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    flexDirection={'column'}
                    xs={12}
                    paddingBottom={0}
                >
                    <MetHeader2 bold>{timelineWidget.title}</MetHeader2>
                    <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                </Grid>
                <Grid item xs={12}>
                    <MetParagraph>{timelineWidget.description}</MetParagraph>
                </Grid>
                <Grid item xs={12}>
                    {timelineWidget &&
                        timelineWidget.events.map((tEvent, index) => handleRenderTimelineEvent(tEvent, index))}
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default TimelineWidgetView;
