import React from 'react';
import { FormContextProvider } from './FormContext';
import { Form } from './Form';

export const FormCAC = () => {
    return (
        <FormContextProvider>
            <Form />
        </FormContextProvider>
    );
};
