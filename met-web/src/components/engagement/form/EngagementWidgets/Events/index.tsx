import React from 'react';
import { EventsProvider } from './EventsContext';
import Form from './Form';
import InPersonEventFormDrawer from './InPersonEventFormDrawer';
import VirtualSessionFormDrawer from './VirtualSessionFormDrawer';

export const EventsForm = () => {
    return (
        <EventsProvider>
            <Form />
            <InPersonEventFormDrawer />
            <VirtualSessionFormDrawer />
        </EventsProvider>
    );
};

export default EventsForm;
