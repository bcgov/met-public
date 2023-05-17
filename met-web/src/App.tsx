import './App.scss';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader, MobileToolbar } from './components/common';
import { Box, Container, useMediaQuery, Theme, Toolbar } from '@mui/material';
import InternalHeader from './components/layout/Header/InternalHeader';
import PublicHeader from './components/layout/Header/PublicHeader';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/feedback/FeedbackModal';
import { AppConfig } from 'config';
import NoAccess from 'routes/NoAccess';
import { getTenant } from 'services/tenantService';
import { Tenant } from 'models/tenant';
import { DEFAULT_TENANT } from './constants';

const App = () => {
    const drawerWidth = 280;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);
    const pathSegments = window.location.pathname.split('/');
    const basename = pathSegments[1];
    const [tenant, setTenant] = useState<Tenant>();

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    useEffect(() => {
        sessionStorage.setItem('apiurl', String(AppConfig.apiUrl));
        fetchTenant();
    }, [basename, AppConfig.apiUrl]);

    const redirectToDefaultTenant = () => {
        const path = window.location.pathname.length > 1 ? window.location.pathname : '';
        window.location.replace(`/${DEFAULT_TENANT}/${path}`);
    };

    const fetchTenant = async () => {
        if (!basename) {
            return redirectToDefaultTenant();
        }

        try {
            const tenant = await getTenant(basename);

            if (tenant) {
                sessionStorage.setItem('tenantId', basename);
                setTenant(tenant);
            } else {
                redirectToDefaultTenant();
            }    
        }
        catch
        {
            redirectToDefaultTenant();
            console.error('Error occurred while fetching Tenant information');
        }
    };

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    if (!tenant) {
        return <></>;
    }

    if (!isLoggedIn) {
        return (
            <Router basename={basename}>
                <PageViewTracker />
                <Notification />
                <NotificationModal />
                <PublicHeader tenant={tenant} />
                <UnauthenticatedRoutes />
                <FeedbackModal />
            </Router>
        );
    }

    if (roles.length === 0) {
        return (
            <Router basename={basename}>
                <PublicHeader tenant={tenant} />
                <Container>
                    <NoAccess />
                </Container>
                <FeedbackModal />
            </Router>
        );
    }

    if (!isMediumScreen) {
        return (
            <Router basename={basename}>
                <InternalHeader tenant={tenant} />
                <Container>
                    <MobileToolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Container>
            </Router>
        );
    }

    return (
        <Router basename={basename}>
            <Box sx={{ display: 'flex' }}>
                <InternalHeader tenant={tenant} drawerWidth={drawerWidth} />
                <Notification />
                <NotificationModal />
                <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)`, marginTop: '17px' }}>
                    <Toolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Box>
            </Box>
        </Router>
    );
};
export default App;
