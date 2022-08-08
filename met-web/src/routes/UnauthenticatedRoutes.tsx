import SurveySubmit from 'components/survey/submit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotFound from './NotFound';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/engagement/view/:engagementId" element={<EngagementView />} />
            <Route path="/survey/submit/:surveyId/:token" element={<SurveySubmit />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
