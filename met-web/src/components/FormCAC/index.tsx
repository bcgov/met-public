import React from 'react';
import { FormContextProvider } from './FormContext';
import { FormTabs } from './FormTabs';

export const FormCAC = () => {
    return (
        <FormContextProvider>
            <FormTabs />
        </FormContextProvider>
    );
};
