import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetParagraph, MetHeader4 } from 'components/common';
import { Avatar, Grid, Skeleton, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { TimelineWidget, TimelineEvent } from 'models/timelineWidget';
import { fetchTimelineWidgets } from 'services/widgetService/TimelineService';
import CheckIcon from '@mui/icons-material/Check';
import LensRoundedIcon from '@mui/icons-material/LensRounded';
import { Palette } from 'styles/Theme';
import { EventStatus } from 'models/timelineWidget';

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
            timeline.events.sort((a, b) => a.position - b.position);
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

    const containerStylesObject = (index: number) => ({
        minHeight: index + 1 === timelineWidget.events.length ? '60px' : '80px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: index + 1 === timelineWidget.events.length ? '18px' : '16px',
        borderLeft: index + 1 === timelineWidget.events.length ? 'none' : '2px solid grey',
    });

    const commonAvatarStyles = {
        height: 30,
        width: 30,
        marginLeft: '-16px',
        backgroundColor: Palette.info.main,
    };

    const commonWhiteAvatarStyles = {
        height: 23,
        width: 23,
        backgroundColor: 'var(--bcds-surface-background-white)',
    };

    const renderIcon = (status: EventStatus) => {
        const icons: { [key in EventStatus]: JSX.Element } = {
            [EventStatus.Pending]: (
                <Avatar sx={commonAvatarStyles}>
                    <Avatar sx={commonWhiteAvatarStyles} />
                </Avatar>
            ),
            [EventStatus.InProgress]: (
                <Avatar sx={commonAvatarStyles}>
                    <Avatar sx={commonWhiteAvatarStyles}>
                        <LensRoundedIcon sx={{ fontSize: '20px', color: Palette.action.active }} />
                    </Avatar>
                </Avatar>
            ),
            [EventStatus.Completed]: (
                <Avatar sx={commonAvatarStyles}>
                    <Avatar sx={commonWhiteAvatarStyles}>
                        <CheckIcon
                            sx={{
                                stroke: Palette.action.active,
                                strokeWidth: 3,
                                fontSize: '20px',
                                color: Palette.action.active,
                            }}
                        />
                    </Avatar>
                </Avatar>
            ),
        };

        return icons[status] || null;
    };

    const handleRenderTimelineEvent = (tEvent: TimelineEvent, index: number) => {
        return (
            <Grid container item xs={12} sx={containerStylesObject(index)} key={'event' + (index + 1)}>
                <Grid item fontWeight="bold" xs={0.5}>
                    {renderIcon(tEvent.status)}
                </Grid>
                <Grid item xs={11} sx={{ paddingLeft: '10px' }}>
                    <MetHeader4 bold>{tEvent.description}</MetHeader4>
                    <MetParagraph
                        style={{
                            paddingBottom: index + 1 === timelineWidget.events.length ? '0' : '20px',
                        }}
                    >
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
