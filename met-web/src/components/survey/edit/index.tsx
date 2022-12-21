import React from 'react';
import SurveySubmitWrapped from './FormWrapped';
import { ActionProvider } from './ActionContext';

const SurveySubmit = () => {
    return (
        <ActionProvider>
            <SurveySubmitWrapped />
        </ActionProvider>
    );
};

export default SurveySubmit;
