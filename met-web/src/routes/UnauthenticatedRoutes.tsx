import SurveySubmit from 'components/survey/submit';
import EditSurvey from 'components/survey/edit';
import React from 'react';
import EngagementView from '../components/engagement/view';
import NotAvailable from './NotAvailable';
import EngagementComments from '../components/engagement/dashboard/comment';
import PublicDashboard from 'components/publicDashboard';
import Landing from 'components/landing';
import ManageSubscription from '../components/engagement/view/widgets/Subscribe/ManageSubscription';
import { FormCAC } from 'components/FormCAC';
import { RedirectLogin } from './RedirectLogin';
import withLanguageParam from './LanguageParam';
import { Navigate, Route } from 'react-router-dom';
import NotFound from './NotFound';
import ViewEngagement, { engagementLoader } from 'components/engagement/new/view';

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
            <Route index element={<Landing />} />
            <Route path="/surveys/submit/:surveyId/:token/:language" element={<SurveySubmitWrapper />} />
            <Route path="/new-look">
                <Route index element={<Navigate to="/" />} />
                <Route
                    path=":slug/:language"
                    loader={engagementLoader}
                    errorElement={<NotFound />}
                    element={<ViewEngagement />}
                />
                <Route path=":engagementId/view/:language" element={<EngagementViewWrapper />} />
            </Route>
            <Route path="/engagements">
                <Route path="create/form/:language" element={<RedirectLoginWrapper />} />
                <Route path=":engagementId">
                    <Route path="view/:language" element={<EngagementViewWrapper />} />
                    <Route path="comments/:dashboardType/:language" element={<EngagementCommentsWrapper />} />
                    <Route path="dashboard/:dashboardType/:language" element={<PublicDashboardWrapper />} />
                    <Route path="edit/:token/:language" element={<EditSurveyWrapper />} />
                    <Route path=":subscriptionStatus/:scriptionKey/:language" element={<ManageSubscriptionWrapper />} />
                    <Route path="form/:language" element={<RedirectLoginWrapper />} />
                    <Route path="cacform/:widgetId/:language" element={<FormCACWrapper />} />
                </Route>
            </Route>
            <Route path=":slug">
                <Route path="dashboard/:dashboardType/:language" element={<PublicDashboardWrapper />} />
                <Route path="comments/:dashboardType/:language" element={<EngagementCommentsWrapper />} />
                <Route path="edit/:token/:language" element={<EditSurveyWrapper />} />
                <Route path="cacform/:widgetId/:language" element={<FormCACWrapper />} />
                <Route path=":language" element={<EngagementViewWrapper />} />
            </Route>
            <Route path="/not-available" element={<NotAvailable />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </>
    );
};

export default UnauthenticatedRoutes;
