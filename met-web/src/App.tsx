import './App.scss';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader, MobileToolbar } from './components/common';
import { Box, Container, useMediaQuery, Theme } from '@mui/material';
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

const App = () => {
    const drawerWidth = 280;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    sessionStorage.setItem('apiurl', String(AppConfig.apiUrl));

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    if (!isLoggedIn) {
        return (
            <Router>
                <PageViewTracker />
                <Notification />
                <NotificationModal />
                <PublicHeader />
                <UnauthenticatedRoutes />
                <FeedbackModal />
            </Router>
        );
    }

    if (roles.length == 0) {
        return (
            <Router>
                <PublicHeader />
                <Container>
                    <NoAccess />
                </Container>
                <FeedbackModal />
            </Router>
        );
    }

    if (!isMediumScreen) {
        return (
            <Router>
                <InternalHeader />
                <Container>
                    <MobileToolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Container>
            </Router>
        );
    }

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <InternalHeader drawerWidth={drawerWidth} />
                <Notification />
                <NotificationModal />
                <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)`, marginTop: '17px' }}>
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Box>
            </Box>
        </Router>
    );
};
export default App;
