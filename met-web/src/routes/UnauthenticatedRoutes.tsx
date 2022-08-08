import SurveySubmit from 'components/survey/submit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotFound from './NotFound';
import EngagementDashboard from '../components/engagement/dashboard/report';
import EngagementCommentDashboard from '../components/engagement/dashboard/comment';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/engagement/view/:engagementId" element={<EngagementView />} />
            <Route path="/engagement/:engagementId/dashboard" element={<EngagementDashboard />} />
            <Route path="/engagement/:engagementId/dashboard/comment" element={<EngagementCommentDashboard />} />
            <Route path="/survey/submit/:surveyId/:token" element={<SurveySubmit />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
