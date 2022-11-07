import './App.scss';
import React, { useEffect } from 'react';
import LoggedOutHeader from './components/layout/Header/LoggedOutHeader';
import { BrowserRouter as Router } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';
import { Box, Container, useMediaQuery, Toolbar, Theme } from '@mui/material';
import LoggedInHeader from './components/layout/Header/LoggedInHeader';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/common/Modals/Feedback';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppConfig } from 'config';

const App = () => {
    const drawerWidth = 240;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
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
                <LoggedOutHeader />
                <UnauthenticatedRoutes />
                <FeedbackModal />
            </Router>
        );
    }

    if (!isMediumScreen) {
        return (
            <Router>
                <LoggedInHeader />
                <Container>
                    <Toolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Container>
            </Router>
        );
    }

    return (
        <Router>
            <DndProvider backend={HTML5Backend}>
                <Box sx={{ display: 'flex' }}>
                    <LoggedInHeader drawerWidth={drawerWidth} />
                    <Notification />
                    <NotificationModal />
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)`, marginTop: '17px' }}
                    >
                        <Toolbar />
                        <AuthenticatedRoutes />
                        <FeedbackModal />
                    </Box>
                </Box>
            </DndProvider>
        </Router>
    );
};
export default App;
