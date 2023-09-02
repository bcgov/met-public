import React, { createContext, useState } from 'react';
import { TAB_ONE } from './constants';

export interface CACFormSubmssion {
    [key: string]: string | boolean | number | undefined;
}

export interface FormContextProps {
    tabValue: number;
    setTabValue: (value: number) => void;
    formSubmission: CACFormSubmssion;
    setFormSubmission: React.Dispatch<React.SetStateAction<CACFormSubmssion>>;
}

export const FormContext = createContext<FormContextProps>({
    tabValue: 1,
    setTabValue: () => {
        return;
    },
    formSubmission: {},
    setFormSubmission: () => {
        return;
    },
});
export const FormContextProvider = ({ children }: { children: JSX.Element }) => {
    const [tabValue, setTabValue] = useState(TAB_ONE);
    const [formSubmission, setFormSubmission] = useState<CACFormSubmssion>({});

    return (
        <FormContext.Provider
            value={{
                tabValue,
                setTabValue,
                formSubmission,
                setFormSubmission,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};
