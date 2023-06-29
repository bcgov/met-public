import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import EngagementForm from '../components/engagement/form';
import EngagementListing from '../components/engagement/listing';
import EngagementView from '../components/engagement/view';
import SurveyListing from 'components/survey/listing';
import CreateSurvey from 'components/survey/create';
import SurveyFormBuilder from 'components/survey/building';
import SurveySubmit from 'components/survey/submit';
import CommentReview from 'components/comments/admin/review/CommentReview';
import CommentReviewListing from 'components/comments/admin/reviewListing';
import CommentTextListing from 'components/comments/admin/textListing';
import PublicDashboard from 'components/publicDashboard';
import EngagementComments from '../components/engagement/dashboard/comment';
import UnderConstruction from './UnderConstruction';
import FeedbackListing from 'components/feedback/listing';
import UserManagementListing from 'components/userManagement/listing';
import Dashboard from 'components/dashboard';
import Unauthorized from './Unauthorized';
import AuthGate from './AuthGate';
import { USER_ROLES } from 'services/userService/constants';
import UserProfile from 'components/userManagement/userDetails';
import ScrollToTop from 'components/scrollToTop';

const AuthenticatedRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/engagements" element={<EngagementListing />} />
                <Route path="/surveys" element={<SurveyListing />} />
                <Route path="/surveys/create" element={<CreateSurvey />} />
                <Route path="/surveys/:surveyId/build" element={<SurveyFormBuilder />} />
                <Route path="/surveys/:surveyId/submit" element={<SurveySubmit />} />
                <Route path="/surveys/:surveyId/comments" element={<CommentReviewListing />} />
                <Route path="/surveys/:surveyId/comments/all" element={<CommentTextListing />} />
                <Route path="/surveys/:surveyId/submissions/:submissionId/review" element={<CommentReview />} />
                <Route element={<AuthGate allowedRoles={[USER_ROLES.CREATE_ENGAGEMENT]} />}>
                    <Route path="/engagements/create/form" element={<EngagementForm />} />
                </Route>
                <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                    <Route path="/engagements/:engagementId/form" element={<EngagementForm />} />
                </Route>
                <Route path="/engagements/:engagementId/view" element={<EngagementView />} />
                <Route path="/engagements/:engagementId/comments" element={<EngagementComments />} />
                <Route path="/engagements/:engagementId/dashboard" element={<PublicDashboard />} />

                <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_FEEDBACKS]} />}>
                    <Route path="/feedback" element={<FeedbackListing />} />
                </Route>

                <Route path="/calendar" element={<UnderConstruction />} />
                <Route path="/reporting" element={<UnderConstruction />} />
                <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_USERS]} />}>
                    <Route path="/usermanagement" element={<UserManagementListing />} />
                </Route>
                <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_USERS]} />}>
                    <Route path="/usermanagement/:userId/details" element={<UserProfile />} />
                </Route>
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default AuthenticatedRoutes;
