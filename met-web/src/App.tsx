import './App.css';
import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouting from './routes/BaseRouting';
import { CircularProgress, Grid } from '@mui/material';
import UserService from './services/UserServices';
import { useAppSelector, useAppDispatch } from './hooks';


const App = () => {

    const dispatch = useAppDispatch();

    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    if (authenticationLoading) {
        return (
            <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: '90vh' }}>
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }

    return (
        <Router>
            <Header /> 
            <BaseRouting />
        </Router>
    );
};

export default App;
