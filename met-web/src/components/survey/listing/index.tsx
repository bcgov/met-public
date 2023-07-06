import React from 'react';
import { SurveyListingContextProvider } from './SurveyListingContext';
import Surveys from './Surveys';

const SubmissionListing = () => {
    return (
        <SurveyListingContextProvider>
            <Surveys />
        </SurveyListingContextProvider>
    );
};

export default SubmissionListing;
