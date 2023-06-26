import SurveySubmit from 'components/survey/submit';
import EditSurvey from 'components/survey/edit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotFound from './NotFound';
import EngagementComments from '../components/engagement/dashboard/comment';
import PublicDashboard from 'components/publicDashboard';
import Landing from 'components/landing';
import ManageSubscription from '../components/engagement/view/widgets/Subscribe/ManageSubscription';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path="/engagements/:engagementId/:subscriptionStatus/:scriptionKey"
                element={<ManageSubscription />}
            />

            <Route path="/engagements/:engagementId/view" element={<EngagementView />} />
            <Route path="/:slug" element={<EngagementView />} />

            <Route path="/engagements/:engagementId/dashboard" element={<PublicDashboard />} />
            <Route path="/:slug/dashboard" element={<PublicDashboard />} />

            <Route path="/engagements/:engagementId/comments" element={<EngagementComments />} />
            <Route path="/:slug/comments" element={<EngagementComments />} />

            <Route path="/surveys/submit/:surveyId/:token" element={<SurveySubmit />} />

            <Route path="/engagements/:engagementId/edit/:token" element={<EditSurvey />} />
            <Route path="/:slug/edit/:token" element={<EditSurvey />} />

            {/* ops page */}
            {/* <Route path="/" element={<NotFound />} /> */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
