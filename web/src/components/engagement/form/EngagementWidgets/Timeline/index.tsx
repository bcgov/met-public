import React from 'react';
import { TimelineContextProvider } from './TimelineContext';
import Form from './Form';

export const TimelineForm = () => {
    return (
        <TimelineContextProvider>
            <Form />
        </TimelineContextProvider>
    );
};

export default TimelineForm;
