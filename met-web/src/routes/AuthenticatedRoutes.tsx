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
import CommentListing from 'components/comments';
import CommentReview from 'components/comments/CommentReview';
import AllComments from 'components/comments/AllComments';

const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survey/listing" element={<SurveyListing />} />
            <Route path="/survey/create" element={<CreateSurvey />} />
            <Route path="/survey/build/:surveyId" element={<SurveyFormBuilder />} />
            <Route path="/survey/submit/:surveyId" element={<SurveySubmit />} />
            <Route path="/survey/:surveyId/comments" element={<CommentListing />} />
            <Route path="/engagement/form/:engagementId" element={<EngagementForm />} />
            <Route path="/engagement/view/:engagementId" element={<EngagementView />} />
            <Route path="/survey/:surveyId/comments" element={<CommentListing />} />
            <Route path="/survey/:surveyId/comments/all" element={<AllComments />} />
            <Route path="/survey/:surveyId/comments/:commentId/review" element={<CommentReview />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AuthenticatedRoutes;
