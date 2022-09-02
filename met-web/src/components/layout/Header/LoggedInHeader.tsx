import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import SideNav from '../SideNav/SideNav';
import CssBaseline from '@mui/material/CssBaseline';
import { Palette } from 'styles/Theme';
import EnvironmentBanner from './EnvironmentBanner';
import { MetHeader1, MetHeader2 } from 'components/common';

const LoggedInHeader = ({ drawerWidth = 240 }) => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    return (
        <>
            <AppBar
                position="fixed"
                color="default"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    color: Palette.text.primary,
                }}
                data-testid="appbar-header"
            >
                <CssBaseline />
                <Toolbar>
                    <Box
                        component="img"
                        sx={{
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                        }}
                        alt="BC Logo"
                        src="https://marketplacebc.ca/wp-content/themes/sbbc-marketplace/images/bc-logo.svg"
                    />
                    {isMediumScreen ? (
                        <MetHeader1 sx={{ flexGrow: 1 }}>MET</MetHeader1>
                    ) : (
                        <MetHeader2 sx={{ flexGrow: 1 }}>MET</MetHeader2>
                    )}
                    <Button data-testid="button-header" color="inherit" onClick={() => UserService.doLogout()}>
                        Logout
                    </Button>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
            <SideNav
                data-testid="sidenav-header"
                isMediumScreen={isMediumScreen}
                open={false}
                drawerWidth={drawerWidth}
            />
        </>
    );
};

export default LoggedInHeader;
