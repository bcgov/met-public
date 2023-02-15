import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { getEvents } from 'services/widgetService/EventService';
import { Event } from 'models/event';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EventsContextProps {
    inPersonFormTabOpen: boolean;
    setInPersonFormTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadEvents: () => void;
    isLoadingEvents: boolean;
    events: Event[];
}

export type EngagementParams = {
    engagementId: string;
};

export const EventsContext = createContext<EventsContextProps>({
    inPersonFormTabOpen: false,
    setInPersonFormTabOpen: () => {
        throw new Error('setInPersonFormTabOpen not implemented');
    },
    widget: null,
    loadEvents: () => {
        throw new Error('loadEvents not implemented');
    },
    isLoadingEvents: false,
    events: [],
});

export const EventsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Events) || null;

    const [inPersonFormTabOpen, setInPersonFormTabOpen] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);

    const loadEvents = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingEvents(true);
            const loadedEvents = await getEvents(widget.id);
            console.log(loadedEvents);
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

    return (
        <EventsContext.Provider
            value={{
                inPersonFormTabOpen,
                setInPersonFormTabOpen,
                widget,
                loadEvents,
                isLoadingEvents,
                events,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};
