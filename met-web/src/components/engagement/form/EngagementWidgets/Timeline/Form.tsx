import React, { useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { Grid, MenuItem, TextField, Select, SelectChangeEvent } from '@mui/material';
import { MetDescription, MetLabel, MidScreenLoader, PrimaryButton, SecondaryButton } from 'components/common';
import { SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { TimelineContext } from './TimelineContext';
import { patchTimeline, postTimeline } from 'services/widgetService/TimelineService';
import { WidgetTitle } from '../WidgetTitle';
import { TimelineEvent } from 'models/timelineWidget';

interface DetailsForm {
    title: string;
    description: string;
    events: TimelineEvent[];
}

interface WidgetState {
    title: string;
    description: string;
}

const Form = () => {
    const dispatch = useAppDispatch();
    const { widget, isLoadingTimelineWidget, timelineWidget } = useContext(TimelineContext);
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const [isCreating, setIsCreating] = React.useState(false);

    const newEvent: TimelineEvent = {
        id: 0,
        widget_id: widget?.id || 0,
        timeline_id: 0,
        engagement_id: widget?.engagement_id || 0,
        description: '',
        time: '',
        status: 1,
        position: 0,
    };

    const [timelineEvents, setTimelineEvents] = React.useState<TimelineEvent[]>(
        timelineWidget ? timelineWidget.events.sort((a, b) => a.position - b.position) : [newEvent],
    );
    const [timelineWidgetState, setTimelineWidgetState] = React.useState<WidgetState>({
        description: timelineWidget?.description || '',
        title: timelineWidget?.title || '',
    });

    const timelineEventStatusTypes = [
        {
            title: 'Pending',
            value: 1,
        },
        {
            title: 'In Progress',
            value: 2,
        },
        {
            title: 'Completed',
            value: 3,
        },
    ];

    useEffect(() => {
        if (timelineWidget) {
            setTimelineEvents(timelineWidget.events.sort((a, b) => a.position - b.position));
            setTimelineWidgetState(timelineWidget);
        }
    }, [timelineWidget]);

    const createTimeline = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }

        const { title, description, events } = data;
        await postTimeline(widget.id, {
            widget_id: widget.id,
            engagement_id: widget.engagement_id,
            title: title,
            description: description,
            events: events,
        });
        dispatch(openNotification({ severity: 'success', text: 'A new timeline was successfully added' }));
    };

    const updateTimeline = async (data: DetailsForm) => {
        if (!widget || !timelineWidget) {
            return;
        }

        if (Object.keys(data).length === 0) {
            return;
        }

        await patchTimeline(widget.id, timelineWidget.id, { ...data });
        dispatch(openNotification({ severity: 'success', text: 'The timeline widget was successfully updated' }));
    };

    const saveTimelineWidget = (data: DetailsForm) => {
        if (!timelineWidget) {
            return createTimeline(data);
        }
        return updateTimeline(data);
    };

    const onSubmit: SubmitHandler<DetailsForm> = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }
        try {
            setIsCreating(true);
            await saveTimelineWidget(data);
            setIsCreating(false);
            handleWidgetDrawerOpen(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add the event' }));
            setIsCreating(false);
        }
    };

    const handleOnSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const eventsForSubmission = [...timelineEvents];
        eventsForSubmission.forEach((event, index) => {
            event.position = index;
        });
        eventsForSubmission.sort((a, b) => a.position - b.position);
        /* eslint "no-warning-comments": [1, { "terms": ["todo", "fix me, replace any type"] }] */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventTarget = event.target as any;
        const restructuredData = {
            title: eventTarget['title']?.value,
            description: eventTarget['description']?.value,
            events: eventsForSubmission,
        };
        setTimelineEvents(eventsForSubmission);
        onSubmit(restructuredData);
    };

    const handleAddEvent = () => {
        if (!timelineEvents) {
            return;
        }
        const newEventWithCorrectIndex = newEvent;
        newEventWithCorrectIndex.position = timelineEvents.length;
        setTimelineEvents([...timelineEvents, newEventWithCorrectIndex]);
    };

    const handleRemoveEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!timelineEvents) {
            return;
        }
        const position = Number(event.target.value);
        const dataToSplice: TimelineEvent[] = [...timelineEvents];
        dataToSplice.splice(position, 1);
        dataToSplice.forEach((event, index) => {
            event.position = index;
        });
        setTimelineEvents([...dataToSplice]);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, property: string) => {
        if (!timelineEvents) {
            return;
        }
        const newValue = e.currentTarget.value;
        if ('description' === property) {
            setTimelineWidgetState({ ...timelineWidgetState, description: newValue });
        } else if ('title' === property) {
            setTimelineWidgetState({ ...timelineWidgetState, title: newValue });
        }
    };

    const handleEventTextChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, property: string) => {
        if (!timelineEvents) {
            return;
        }
        const newValue = e.currentTarget.value;
        const newArray = [...timelineEvents];
        if ('description' === property) {
            newArray[index].description = newValue;
            setTimelineEvents([...newArray]);
        } else if ('time' === property) {
            newArray[index].time = newValue;
            setTimelineEvents([...newArray]);
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>, index: number) => {
        if (!timelineEvents) {
            return;
        }
        const newValue = e.target.value;
        const newArray = [...timelineEvents];
        newArray[index].status = Number(newValue);
        setTimelineEvents([...newArray]);
    };

    if (isLoadingTimelineWidget || !widget) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <MidScreenLoader />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={(event) => handleOnSubmit(event)} id="timelineForm">
                    <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetLabel>Title</MetLabel>
                            <MetDescription>The title must be less than 255 characters.</MetDescription>
                            <TextField
                                name="title"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                value={timelineWidgetState?.title}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    handleTextChange(event, 'title');
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>Description</MetLabel>
                            <TextField
                                name="description"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                multiline
                                rows={4}
                                value={timelineWidgetState?.description}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    handleTextChange(event, 'description');
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            direction="column"
                            alignItems={'stretch'}
                            justifyContent="flex-start"
                            spacing={2}
                            mt={'3em'}
                        >
                            {timelineEvents &&
                                timelineEvents.map((tEvent, index) => (
                                    <Grid
                                        item
                                        className={'event' + (index + 1)}
                                        key={'event' + index + 1}
                                        spacing={1}
                                        container
                                        mb={'1em'}
                                        xs={12}
                                    >
                                        <MetLabel sx={{ paddingLeft: '8px' }}>{'EVENT ' + (index + 1)}</MetLabel>

                                        <Grid item xs={12}>
                                            <MetLabel>Event Description</MetLabel>
                                            <MetDescription>Describe the timeline event.</MetDescription>
                                            <TextField
                                                name={'eventDescription' + (index + 1)}
                                                id={'eventDescription' + (index + 1)}
                                                variant="outlined"
                                                value={tEvent.description}
                                                fullWidth
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    handleEventTextChange(event, index, 'description');
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <MetLabel>Event Time</MetLabel>
                                            <MetDescription>When did the event happen?</MetDescription>
                                            <TextField
                                                name={'eventTime' + (index + 1)}
                                                id={'eventTime' + (index + 1)}
                                                variant="outlined"
                                                value={tEvent.time}
                                                fullWidth
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    handleEventTextChange(event, index, 'time');
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <MetLabel>Event Status</MetLabel>
                                            <Select
                                                name={'eventStatus' + (index + 1)}
                                                id={'eventStatus' + (index + 1)}
                                                variant="outlined"
                                                value={tEvent.status?.toString()}
                                                defaultValue="Select an event status"
                                                fullWidth
                                                onChange={(event: SelectChangeEvent<string>) => {
                                                    handleSelectChange(event, index);
                                                }}
                                            >
                                                {timelineEventStatusTypes.map((statusType) => (
                                                    <MenuItem
                                                        key={`status-type-${statusType.value || 1}`}
                                                        value={statusType.value || 1}
                                                    >
                                                        {statusType.title || 'Pending'}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>

                                        {1 < timelineEvents.length && (
                                            <Grid item xs={12} sx={{ marginTop: '8px' }}>
                                                <SecondaryButton
                                                    value={index}
                                                    onClick={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        handleRemoveEvent(event);
                                                    }}
                                                >
                                                    Remove Event
                                                </SecondaryButton>
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <Divider sx={{ marginTop: '1em' }} />
                                        </Grid>
                                    </Grid>
                                ))}
                            <Grid item>
                                <PrimaryButton onClick={() => handleAddEvent()}>Add Event</PrimaryButton>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            alignItems={'flex-start'}
                            justifyContent="flex-start"
                            spacing={2}
                            mt={'3em'}
                        >
                            <Grid item>
                                <PrimaryButton type="submit" disabled={isCreating}>
                                    Save & Close
                                </PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>Cancel</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default Form;
