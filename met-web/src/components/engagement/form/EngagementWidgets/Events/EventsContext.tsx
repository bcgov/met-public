import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { getEvents, sortWidgetEvents } from 'services/widgetService/EventService';
import { EVENT_TYPE, Event, EventItem, EventType, EventTypeLabel } from 'models/event';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EventsContextProps {
    inPersonFormTabOpen: boolean;
    setInPersonFormTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    virtualSessionFormTabOpen: boolean;
    setVirtualSessionFormTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadEvents: () => void;
    isLoadingEvents: boolean;
    events: Event[];
    eventToEdit: EventItem | null;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    handleChangeEventToEdit: (_event: EventItem | null) => void;
    handleEventDrawerOpen: (_event: EventType | EventTypeLabel, _open: boolean) => void;
    updateWidgetEventsSorting: (widget_events: Event[]) => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const EventsContext = createContext<EventsContextProps>({
    inPersonFormTabOpen: false,
    virtualSessionFormTabOpen: false,
    setInPersonFormTabOpen: () => {
        throw new Error('setInPersonFormTabOpen not implemented');
    },
    setVirtualSessionFormTabOpen: () => {
        throw new Error('setVirtualSessionFormTab not implemented');
    },
    widget: null,
    loadEvents: () => {
        throw new Error('loadEvents not implemented');
    },
    isLoadingEvents: false,
    setEvents: (updatedEvent: React.SetStateAction<Event[]>) => [],
    events: [],
    eventToEdit: null,
    handleChangeEventToEdit: () => {
        /* empty default method  */
    },
    handleEventDrawerOpen: (_event: EventType | EventTypeLabel, _open: boolean) => {
        /* empty default method  */
    },
    updateWidgetEventsSorting: (widget_events: Event[]) => {
        /* empty default method  */
    },
});

export const EventsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Events) || null;
    const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);
    const [inPersonFormTabOpen, setInPersonFormTabOpen] = useState(false);
    const [virtualSessionFormTabOpen, setVirtualSessionFormTabOpen] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);

    const loadEvents = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingEvents(true);
            const loadedEvents = await getEvents(widget.id);
            setEvents(loadedEvents);
            setIsLoadingEvents(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to load the events' }),
            );
        }
    };

    const handleChangeEventToEdit = (event: EventItem | null) => {
        setEventToEdit(event);
    };

    const handleEventDrawerOpen = (type: EventType | EventTypeLabel, open: boolean) => {
        if (type === EVENT_TYPE.OPENHOUSE.value || type === EVENT_TYPE.MEETUP.value) {
            setInPersonFormTabOpen(open);
        } else if (type === EVENT_TYPE.VIRTUAL.value) {
            setVirtualSessionFormTabOpen(open);
        }
        if (!open && eventToEdit) {
            setEventToEdit(null);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const updateWidgetEventsSorting = async (resortedWidgetEvents: Event[]) => {
        if (!widget) {
            return;
        }
        try {
            await sortWidgetEvents(widget.id, resortedWidgetEvents);
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error sorting widget events' }));
        }
    };

    return (
        <EventsContext.Provider
            value={{
                virtualSessionFormTabOpen,
                setVirtualSessionFormTabOpen,
                inPersonFormTabOpen,
                setInPersonFormTabOpen,
                eventToEdit,
                handleChangeEventToEdit,
                handleEventDrawerOpen,
                widget,
                loadEvents,
                isLoadingEvents,
                setEvents,
                events,
                updateWidgetEventsSorting,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};
