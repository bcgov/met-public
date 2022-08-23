import SurveySubmit from 'components/survey/submit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotFound from './NotFound';
import EngagementDashboard from '../components/engagement/dashboard/report';
import EngagementCommentDashboard from '../components/engagement/dashboard/comment';
import EngagementComments from '../components/engagement/dashboard/comment';
import HomePage from 'components/homePage/homePage';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/engagement/view/:engagementId" element={<EngagementView />} />
            <Route path="/engagement/:engagementId/dashboard" element={<EngagementDashboard />} />
            <Route path="/engagement/:engagementId/comments" element={<EngagementComments />} />
            <Route path="/survey/submit/:surveyId/:token" element={<SurveySubmit />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
