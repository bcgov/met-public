import React from 'react';
import { EventsProvider } from './EventsContext';
import Form from './Form';
import InPersonEventFormDrawer from './InPersonEventFormDrawer';

export const EventsForm = () => {
    return (
        <EventsProvider>
            <Form />
            <InPersonEventFormDrawer />
        </EventsProvider>
    );
};

export default EventsForm;
