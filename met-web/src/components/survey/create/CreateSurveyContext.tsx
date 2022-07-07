import React, { createContext, useState } from 'react';

interface CreateSurveyContextValues {
    surveyForm: SurveyForm;
    handleSurveyFormChange: (_form: SurveyForm) => void;
}

const initialSurveyForm = {
    name: '',
};
export const CreateSurveyContext = createContext<CreateSurveyContextValues>({
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
    const [surveyForm, setSurveyForm] = useState<SurveyForm>(initialSurveyForm);

    const handleSurveyFormChange = (form: SurveyForm) => {
        setSurveyForm(form);
    };

    return (
        <CreateSurveyContext.Provider
            value={{
                surveyForm,
                handleSurveyFormChange,
            }}
        >
            {children}
        </CreateSurveyContext.Provider>
    );
};
