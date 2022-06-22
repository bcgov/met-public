import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from './LandingPage/LandingPage';
import { ThemeProvider } from '@mui/system';
import { BaseTheme, PublicTheme } from 'styles/Theme';
import UserService from 'services/userService';
import View from 'components/Form/View';
import Engagement from 'components/engagement';

const AuthenticatedRoutes = () => {
    let adminRole = UserService.hasAdminRole();

    //TODO: Remove when we setup roles
    adminRole = true;

    return (
        <ThemeProvider theme={adminRole ? BaseTheme : PublicTheme}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/survey" element={<View />} />
                <Route path="/engagement/:engagementId" element={<Engagement />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AuthenticatedRoutes;
