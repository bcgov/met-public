import './App.scss';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
import NotFound from 'routes/NotFound';
import Footer from 'components/layout/Footer';
import { ZIndex } from 'styles/Theme';

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
        console.log('Redirecting to default tenant.');
        if (!window.location.toString().includes(DEFAULT_TENANT)) {
            window.location.replace(`/${DEFAULT_TENANT}/`);
        }
    };

    const fetchTenant = async () => {
        if (!basename) {
            return redirectToDefaultTenant();
        }

        try {
            const tenant = await getTenant(basename);

            if (tenant) {
                sessionStorage.setItem('tenantId', basename);
                sessionStorage.setItem('appBaseUrl', window.location.origin + '/' + basename);
                setTenant(tenant);
            }
        } catch {
            console.error('Error occurred while fetching Tenant information');
        }
    };

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    if (!tenant) {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        );
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
                <Footer />
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
                <Footer />
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
                    <Footer />
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
            <Box
                sx={{
                    backgroundColor: 'white',
                    zIndex: ZIndex.footer,
                    position: 'relative',
                    paddingTop: '5em',
                }}
            >
                <Footer />
            </Box>
        </Router>
    );
};
export default App;
