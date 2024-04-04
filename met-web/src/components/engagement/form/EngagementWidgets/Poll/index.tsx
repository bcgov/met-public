import React from 'react';
import { PollContextProvider } from './PollContext';
import Form from './Form';

export const PollForm = () => {
    return (
        <PollContextProvider>
            <Form />
        </PollContextProvider>
    );
};

export default PollForm;
