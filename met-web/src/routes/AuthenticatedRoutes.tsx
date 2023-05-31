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
import { SCOPES } from 'components/permissionsGate/PermissionMaps';
import UserProfile from 'components/userManagement/userDetails';

const AuthenticatedRoutes = () => {
    return (
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
            <Route element={<AuthGate allowedRoles={[SCOPES.createEngagement, SCOPES.editEngagement]} />}>
                <Route path="/engagements/:engagementId/form" element={<EngagementForm />} />
            </Route>
            <Route path="/engagements/:engagementId/view" element={<EngagementView />} />
            <Route path="/engagements/:engagementId/comments" element={<EngagementComments />} />
            <Route path="/engagements/:engagementId/dashboard" element={<PublicDashboard />} />
            <Route path="/feedback" element={<FeedbackListing />} />
            <Route path="/calendar" element={<UnderConstruction />} />
            <Route path="/reporting" element={<UnderConstruction />} />
            <Route path="/usermanagement" element={<UserManagementListing />} />
            <Route path="/usermanagement/:userId/details" element={<UserProfile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AuthenticatedRoutes;
