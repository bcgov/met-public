import './App.css';
import React, { useEffect } from 'react';
import LoggedOutHeader from './components/layout/Header/LoggedOutHeader';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouting from './routes/BaseRouting';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';
import { Box, Container } from '@mui/material';
import LoggedInHeader from './components/layout/Header/LoggedInHeader';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { useMediaQuery, Toolbar, Grid } from '@mui/material';

const App = () => {
    const drawerWidth = 240;
    const isMediumScreen: boolean = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    if (!isLoggedIn) {
        return (
            <Router>
                <LoggedOutHeader />
                <UnauthenticatedRoutes />
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
                </Container>
            </Router>
        );
    }

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <LoggedInHeader drawerWidth={drawerWidth} />

                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)`, marginTop: '2em' }}
                >
                    <Toolbar />
                    <AuthenticatedRoutes />
                </Box>
            </Box>
        </Router>
    );
};

export default App;
