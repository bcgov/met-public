import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from '../components/LandingPage/LandingPage';
import { ThemeProvider } from '@mui/system';
import { BaseTheme, PublicTheme } from '../styles/Theme';
import UserService from '../services/userService';
import EngagementForm from '../components/engagement/form';
import Engagement from '../components/engagement/view';
import SurveyListing from 'components/survey/listing';
import CreateSurvey from 'components/survey/create';
import SurveyFormBuilder from 'components/survey/building';

const AuthenticatedRoutes = () => {
    let adminRole = UserService.hasAdminRole();

    //TODO: Remove when we setup roles
    adminRole = true;

    return (
        <ThemeProvider theme={adminRole ? BaseTheme : PublicTheme}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/survey/listing" element={<SurveyListing />} />
                <Route path="/survey/create" element={<CreateSurvey />} />
                <Route path="/survey/build/:surveyId" element={<SurveyFormBuilder />} />
                <Route path="/engagement/form/:engagementId" element={<EngagementForm />} />
                <Route path="/engagement/view/:engagementId" element={<Engagement />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AuthenticatedRoutes;
