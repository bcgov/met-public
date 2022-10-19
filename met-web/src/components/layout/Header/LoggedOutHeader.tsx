import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ConditionalComponent, MetHeader1, MetHeader2 } from 'components/common';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoLight.svg';

const LoggedOutHeader = () => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const location = useLocation();
    const loginPage = location.pathname === '/';
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
                    <ConditionalComponent condition={loginPage}>
                        {isMediumScreen ? (
                            <MetHeader1 sx={{ flexGrow: 1 }}> Login to MET</MetHeader1>
                        ) : (
                            <MetHeader2 sx={{ flexGrow: 1 }}>Login to MET</MetHeader2>
                        )}

                        <Button color="inherit" onClick={() => UserService.doLogin()}>
                            Login
                        </Button>
                    </ConditionalComponent>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
        </Box>
    );
};

export default LoggedOutHeader;
