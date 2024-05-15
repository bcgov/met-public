import React from 'react';
import UserService from 'services/userService';
import { Grid } from '@mui/material';
import { useAppSelector } from 'hooks';
import { PrimaryButtonOld } from 'components/common';
const Login = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} padding="2em">
            {isLoggedIn ? (
                <PrimaryButtonOld className="btn btn-lg btn-warning" onClick={() => UserService.doLogout()}>
                    Logout
                </PrimaryButtonOld>
            ) : (
                <PrimaryButtonOld className="btn btn-lg btn-warning" onClick={() => UserService.doLogin()}>
                    Login
                </PrimaryButtonOld>
            )}
        </Grid>
    );
};

export default Login;
