import { Skeleton } from '@mui/material';
import { MetPaper } from 'components/common';
import FormSubmit from 'components/Form/FormSubmit';
import React from 'react';

interface SurveyFormProps {
    surveyFormData: unknown;
    loading: boolean;
}
export const SurveyForm = ({ loading, surveyFormData }: SurveyFormProps) => {
    const handleChange = (form: unknown) => {
        console.log(form);
    };

    if (loading) {
        return <Skeleton variant="rectangular" height="30em" width="100%" />;
    }
    return <FormSubmit savedForm={surveyFormData} handleFormChange={handleChange} />;
};
