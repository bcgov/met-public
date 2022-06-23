import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from './LandingPage/LandingPage';
import { ThemeProvider } from '@mui/system';
import { BaseTheme, PublicTheme } from '../styles/Theme';
import UserService from '../services/userService';
import View from '../components/Form/View';
import EngagementForm from '../components/engagement/form';
import Engagement from '../components/engagement/view';

const AuthenticatedRoutes = () => {
    let adminRole = UserService.hasAdminRole();

    //TODO: Remove when we setup roles
    adminRole = true;

    return (
        <ThemeProvider theme={adminRole ? BaseTheme : PublicTheme}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/survey" element={<View />} />
                <Route path="/engagement/form/:engagementId" element={<EngagementForm />} />
                <Route path="/engagement/view/:engagementId" element={<Engagement />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AuthenticatedRoutes;
