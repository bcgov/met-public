import SurveySubmit from 'components/survey/submit';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Engagement from '../components/engagement/view';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/engagement/view/:engagementId" element={<Engagement />} />
            <Route path="/survey/submit/:surveyId" element={<SurveySubmit />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
