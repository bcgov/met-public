import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from '../components/LandingPage/LandingPage';
import EngagementForm from '../components/engagement/form';
import EngagementView from '../components/engagement/view';
import SurveyListing from 'components/survey/listing';
import CreateSurvey from 'components/survey/create';
import SurveyFormBuilder from 'components/survey/building';
import SurveySubmit from 'components/survey/submit';
import CommentReview from 'components/comments/admin/review/CommentReview';
import CommentReviewListing from 'components/comments/admin/reviewListing';
import CommentTextListing from 'components/comments/admin/textListing';
import EngagementDashboard from '../components/engagement/dashboard/report';
import EngagementComments from '../components/engagement/dashboard/comment';
import UnderConstruction from './UnderConstruction';

const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survey/listing" element={<SurveyListing />} />
            <Route path="/survey/create" element={<CreateSurvey />} />
            <Route path="/survey/:surveyId/build" element={<SurveyFormBuilder />} />
            <Route path="/survey/:surveryId/submit" element={<SurveySubmit />} />
            <Route path="/survey/:surveyId/comments" element={<CommentReviewListing />} />
            <Route path="/survey/:surveyId/comments/all" element={<CommentTextListing />} />
            <Route path="/engagement/:engagementId/form" element={<EngagementForm />} />
            <Route path="/engagement/:engagementId/view" element={<EngagementView />} />
            <Route path="/engagement/:engagementId/comments" element={<EngagementComments />} />
            <Route path="/engagement/:engagementId/dashboard" element={<EngagementDashboard />} />
            <Route path="/survey/:surveyId/comments/:commentId/review" element={<CommentReview />} />
            <Route path="/calendar" element={<UnderConstruction />} />
            <Route path="/reporting" element={<UnderConstruction />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AuthenticatedRoutes;
