import React from 'react';
import { CreateSurveyContextProvider } from './CreateSurveyContext';
import CreateSurveyTabs from './CreateSurveyTabs';

const CreateSurvey = () => {
    return (
        <CreateSurveyContextProvider>
            <CreateSurveyTabs />
        </CreateSurveyContextProvider>
    );
};

export default CreateSurvey;
