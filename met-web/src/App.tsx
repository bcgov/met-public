import './App.css';
import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouting from './routes/BaseRouting';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';
import { Box } from '@mui/material';

const App = () => {
    const dispatch = useAppDispatch();

    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box sx={{ paddingTop: '15vh', paddingLeft: '1em' }}>
                    <BaseRouting />
                </Box>
            </Box>
        </Router>
    );
};

export default App;
