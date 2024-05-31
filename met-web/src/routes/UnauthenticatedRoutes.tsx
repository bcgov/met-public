import SurveySubmit from 'components/survey/submit';
import EditSurvey from 'components/survey/edit';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngagementView from '../components/engagement/view';
import NotAvailable from './NotAvailable';
import NotFound from './NotFound';
import EngagementComments from '../components/engagement/dashboard/comment';
import PublicDashboard from 'components/publicDashboard';
import Landing from 'components/landing';
import ManageSubscription from '../components/engagement/view/widgets/Subscribe/ManageSubscription';
import { FormCAC } from 'components/FormCAC';
import ScrollToTop from 'components/scrollToTop';
import { RedirectLogin } from './RedirectLogin';
import withLanguageParam from './LanguageParam';

const ManageSubscriptionWrapper = withLanguageParam(ManageSubscription);
const EngagementViewWrapper = withLanguageParam(EngagementView);
const PublicDashboardWrapper = withLanguageParam(PublicDashboard);
const EngagementCommentsWrapper = withLanguageParam(EngagementComments);
const EditSurveyWrapper = withLanguageParam(EditSurvey);
const SurveySubmitWrapper = withLanguageParam(SurveySubmit);
const FormCACWrapper = withLanguageParam(FormCAC);
const RedirectLoginWrapper = withLanguageParam(RedirectLogin);

const UnauthenticatedRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                    path="/engagements/:engagementId/:subscriptionStatus/:scriptionKey/:language"
                    element={<ManageSubscriptionWrapper />}
                />
                <Route path="/engagements/:engagementId/view/:language" element={<EngagementViewWrapper />} />
                <Route path="/:slug/:language" element={<EngagementViewWrapper />} />
                <Route
                    path="/engagements/:engagementId/dashboard/:dashboardType/:language"
                    element={<PublicDashboardWrapper />}
                />
                <Route path="/:slug/dashboard/:dashboardType/:language" element={<PublicDashboardWrapper />} />
                <Route
                    path="/engagements/:engagementId/comments/:dashboardType/:language"
                    element={<EngagementCommentsWrapper />}
                />
                <Route path="/:slug/comments/:dashboardType/:language" element={<EngagementCommentsWrapper />} />
                <Route path="/engagements/:engagementId/edit/:token/:language" element={<EditSurveyWrapper />} />
                <Route path="/:slug/edit/:token/:language" element={<EditSurveyWrapper />} />
                <Route path="/surveys/submit/:surveyId/:token/:language" element={<SurveySubmitWrapper />} />
                <Route path="/engagements/:engagementId/cacform/:widgetId/:language" element={<FormCACWrapper />} />
                <Route path="/engagements/create/form/:language" element={<RedirectLoginWrapper />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/not-available" element={<NotAvailable />} />
            </Routes>
        </>
    );
};

export default UnauthenticatedRoutes;
