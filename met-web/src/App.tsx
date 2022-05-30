import './App.css';
import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouting from './routes/BaseRouting';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';

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
            <Header />
            <BaseRouting />
        </Router>
    );
};

export default App;
