import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { MetHeader1, MetHeader2 } from 'components/common';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoLight.svg';
import { Unless, When } from 'react-if';
import { useAppSelector } from 'hooks';

const PublicHeader = () => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const location = useLocation();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const loginPage = location.pathname === '/';
    const title = loginPage && !isLoggedIn ? 'Login to MET' : 'MET';
    console.log('location', location.pathname);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box
                        component={BCLogo}
                        sx={{
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                        }}
                        alt="British Columbia Logo"
                    />
                    <When condition={loginPage}>
                        <When condition={isMediumScreen}>
                            <MetHeader1 sx={{ flexGrow: 1 }}>{title}</MetHeader1>
                        </When>
                        <Unless condition={isMediumScreen}>
                            <MetHeader2 sx={{ flexGrow: 1 }}>{title}</MetHeader2>
                        </Unless>
                        <When condition={isLoggedIn}>
                            <Button color="inherit" onClick={() => UserService.doLogout()}>
                                Logout
                            </Button>
                        </When>
                        <Unless condition={isLoggedIn}>
                            <Button color="inherit" onClick={() => UserService.doLogin()}>
                                Login
                            </Button>
                        </Unless>
                    </When>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
        </Box>
    );
};

export default PublicHeader;
