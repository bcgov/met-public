import React, { createContext, useState } from 'react';
import { TAB_VALUES } from './constants';

interface CreateSurveyContextValues {
    tabValue: number;
    handleTabValueChange: (newTabValue: number) => void;
    surveyForm: SurveyForm;
    handleSurveyFormChange: (_form: SurveyForm) => void;
}

const initialSurveyForm = {
    name: '',
};
export const CreateSurveyContext = createContext<CreateSurveyContextValues>({
    tabValue: 0,
    handleTabValueChange: (_newTabValue: number) => {
        //empty method
    },
    surveyForm: initialSurveyForm,
    handleSurveyFormChange: (_form: SurveyForm) => {
        //empty method
    },
});

interface SurveyForm {
    name: string;
    structure?: unknown;
}

export const CreateSurveyContextProvider = ({ children }: { children: JSX.Element }) => {
    const [tabValue, setTabValue] = useState(0);
    const [surveyForm, setSurveyForm] = useState<SurveyForm>(initialSurveyForm);

    const handleTabValueChange = (newTabValue: number) => {
        setTabValue(newTabValue);
    };

    const handleSurveyFormChange = (form: SurveyForm) => {
        setSurveyForm(form);
    };

    return (
        <CreateSurveyContext.Provider
            value={{
                tabValue,
                handleTabValueChange,
                surveyForm,
                handleSurveyFormChange,
            }}
        >
            {children}
        </CreateSurveyContext.Provider>
    );
};
