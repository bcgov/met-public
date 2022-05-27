import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from './LandingPage/LandingPage';
import { ThemeProvider } from '@mui/system';
import { BaseTheme, PublicTheme } from '../styles/Theme';
import UserService from '../services/UserServices';
import View from '../components/Form/View';
import CreateEngagementForm from '../components/engagement/CreateEngagementForm';
import Engagement from '../components/engagement';
import SideNav from '../components/layout/SideNav/SideNav';

const AuthenticatedRoutes = () => {
    let adminRole = UserService.hasAdminRole();
    //ToDO: remove when roles are defined in keycloak
    adminRole = true;

    return (
        <ThemeProvider theme={BaseTheme}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/survey" element={<View />} />
                <Route path="/engagement/create" element={<Engagement />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AuthenticatedRoutes;
