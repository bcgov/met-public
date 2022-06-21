import React from 'react';
import UserService from 'services/userService';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useAppSelector } from 'hooks';

const Login = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} padding="2em">
            {isLoggedIn ? (
                <Button variant="contained" className="btn btn-lg btn-warning" onClick={() => UserService.doLogout()}>
                    Logout
                </Button>
            ) : (
                <Button variant="contained" className="btn btn-lg btn-warning" onClick={() => UserService.doLogin()}>
                    Login
                </Button>
            )}
        </Grid>
    );
};

export default Login;
