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

const EventsInfoBlock = () => {
    const { events, setEvents, isLoadingEvents, updateWidgetEventsSorting } = useContext(EventsContext);

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

    return (
        <DragDropContext onDragEnd={moveEvent}>
            <MetDroppable droppableId="droppable">
                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                    {events.map((event: Event, index) => {
                        return (
                            <Grid item xs={12} key={`Grid-${event.id}`}>
                                <MetDraggable draggableId={String(event.id)} index={index}>
                                    <When condition={event.type === EVENT_TYPE.MEETUP.value}>
                                        <EventInfoPaper event={event} />
                                    </When>
                                    <When condition={event.type === EVENT_TYPE.OPENHOUSE.value}>
                                        <EventInfoPaper event={event} />
                                    </When>
                                    <When condition={event.type === EVENT_TYPE.VIRTUAL.value}>
                                        <VirtualEventInfoPaper event={event} />
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
