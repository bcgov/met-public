import React from 'react';
import UserService from 'services/userService';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useAppSelector } from 'hooks';
import { PrimaryButton } from 'components/common';

const Login = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} padding="2em">
            {isLoggedIn ? (
                <PrimaryButton
                    variant="contained"
                    className="btn btn-lg btn-warning"
                    onClick={() => UserService.doLogout()}
                >
                    Logout
                </PrimaryButton>
            ) : (
                <PrimaryButton
                    variant="contained"
                    className="btn btn-lg btn-warning"
                    onClick={() => UserService.doLogin()}
                >
                    Login
                </PrimaryButton>
            )}
        </Grid>
    );
};

export default Login;
