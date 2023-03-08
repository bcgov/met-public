import React, { useContext, useRef } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { EventsContext } from './EventsContext';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { MetDraggable, MetDroppable } from 'components/common/Dragdrop';
import { reorder } from 'utils';
import { Event, EVENT_TYPE } from 'models/event';
import EventInfoPaper from './EventInfoPaper';
import VirtualEventInfoPaper from './VirtualEventInfoPaper';
import { When } from 'react-if';
import { debounce } from 'lodash';
import { deleteEvent } from 'services/widgetService/EventService';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';

const EventsInfoBlock = () => {
    const { events, setEvents, isLoadingEvents, updateWidgetEventsSorting, widget } = useContext(EventsContext);
    const dispatch = useAppDispatch();
    const debounceUpdateWidgetEventsSorting = useRef(
        debounce((widgetEventsToSort: Event[]) => {
            updateWidgetEventsSorting(widgetEventsToSort);
        }, 800),
    ).current;

    const moveEvent = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(events, result.source.index, result.destination.index);

        setEvents(items);

        debounceUpdateWidgetEventsSorting(items);
    };

    if (isLoadingEvents) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="12em" />
                </Grid>
            </Grid>
        );
    }

    const handleRemoveEvent = (eventId: number) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Remove Event',
                    subText: [
                        {
                            text: 'You will be removing this event from the engagement.',
                        },
                        {
                            text: 'Do you want to remove this event?',
                        },
                    ],
                    handleConfirm: () => {
                        removeEvent(eventId);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    const removeEvent = async (eventId: number) => {
        try {
            if (widget) {
                await deleteEvent(widget.id, eventId);
                const newEvents = events.filter((event) => event.id !== eventId);
                setEvents([...newEvents]);
                dispatch(openNotification({ severity: 'success', text: 'The event was removed successfully' }));
            }
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to remove event' }));
        }
    };

    return (
        <DragDropContext onDragEnd={moveEvent}>
            <MetDroppable droppableId="droppable">
                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                    {events.map((event: Event, index) => {
                        return (
                            <Grid item xs={12} key={`Grid-${event.id}`}>
                                <MetDraggable draggableId={String(event.id)} index={index}>
                                    <When condition={event.type === EVENT_TYPE.MEETUP}>
                                        <EventInfoPaper removeEvent={handleRemoveEvent} event={event} />
                                    </When>
                                    <When condition={event.type === EVENT_TYPE.OPENHOUSE}>
                                        <EventInfoPaper removeEvent={handleRemoveEvent} event={event} />
                                    </When>
                                    <When condition={event.type === EVENT_TYPE.VIRTUAL}>
                                        <VirtualEventInfoPaper removeEvent={handleRemoveEvent} event={event} />
                                    </When>
                                </MetDraggable>
                            </Grid>
                        );
                    })}
                </Grid>
            </MetDroppable>
        </DragDropContext>
    );
};

export default EventsInfoBlock;
