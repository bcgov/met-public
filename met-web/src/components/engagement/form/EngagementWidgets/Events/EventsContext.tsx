import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { getEvents, sortWidgetEvents } from 'services/widgetService/EventService';
import { EVENT_TYPE, Event, EventTypeLabel } from 'models/event';
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
    eventToEdit: Event | null;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    handleChangeEventToEdit: (_event: Event | null) => void;
    handleEventDrawerOpen: (_event: EventTypeLabel, _open: boolean) => void;
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
    handleEventDrawerOpen: (_event: EventTypeLabel, _open: boolean) => {
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
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
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

    const handleChangeEventToEdit = (event: Event | null) => {
        setEventToEdit(event);
    };

    const handleEventDrawerOpen = (type: EventTypeLabel, open: boolean) => {
        if (type === EVENT_TYPE.OPENHOUSE || type === EVENT_TYPE.MEETUP) {
            setInPersonFormTabOpen(open);
        } else if (type === EVENT_TYPE.VIRTUAL) {
            setVirtualSessionFormTabOpen(open);
        }
        if (!open && eventToEdit) {
            setEventToEdit(null);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [widget]);

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
