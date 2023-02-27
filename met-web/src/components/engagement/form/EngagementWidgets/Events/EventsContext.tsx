import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { getEvents, sortWidgetEvents } from 'services/widgetService/EventService';
import { Event } from 'models/event';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EventsContextProps {
    inPersonFormTabOpen: boolean;
    setInPersonFormTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    virtualSessionFormTabOpen: boolean;
    setVirtualSessionFormTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadEvents: () => void;
    isLoadingEvents: boolean;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    events: Event[];
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
    updateWidgetEventsSorting: (widget_events: Event[]) => {
        /* empty default method  */
    },
});

export const EventsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Events) || null;

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
