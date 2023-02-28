import SurveySubmit from 'components/survey/submit';
import EditSurvey from 'components/survey/edit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotFound from './NotFound';
import EngagementDashboard from '../components/engagement/dashboard/report';
import EngagementComments from '../components/engagement/dashboard/comment';
import HomePage from 'components/homePage/homePage';
import Landing from 'components/landing';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/engagements/:engagementId/subscribe/:token" element={<EngagementView />} />
            <Route path="/engagements/:engagementId/view" element={<EngagementView />} />
            <Route path="/engagements/:engagementId/dashboard" element={<EngagementDashboard />} />
            <Route path="/engagements/:engagementId/comments" element={<EngagementComments />} />
            <Route path="/surveys/submit/:surveyId/:token" element={<SurveySubmit />} />
            <Route path="/engagements/:engagementId/edit/:token" element={<EditSurvey />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
