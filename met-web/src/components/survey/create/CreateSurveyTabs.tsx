import React from 'react';
import OptionsForm from './OptionsForm';
import { MetPageGridContainer } from 'components/common';

const CreateSurveyTabs = () => {
    return (
        <MetPageGridContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <OptionsForm />
        </MetPageGridContainer>
    );
};

export default CreateSurveyTabs;
