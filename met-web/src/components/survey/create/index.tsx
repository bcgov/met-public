import React from 'react';
import { CreateSurveyContextProvider } from './CreateSurveyContext';
import OptionsForm from './OptionsForm';

const CreateSurvey = () => {
    return (
        <CreateSurveyContextProvider>
            <OptionsForm />
        </CreateSurveyContextProvider>
    );
};

export default CreateSurvey;
