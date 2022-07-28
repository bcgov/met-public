import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import SideNav from '../SideNav/SideNav';
import CssBaseline from '@mui/material/CssBaseline';
import { Palette } from 'styles/Theme';

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
                    <Typography variant={isMediumScreen ? 'h3' : 'h6'} sx={{ flexGrow: 1 }}>
                        MET
                    </Typography>
                    <Button data-testid="button-header" color="inherit" onClick={() => UserService.doLogout()}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <SideNav
                data-testid="sidenav-header"
                isMediumScreen={isMediumScreen}
                open={true}
                drawerWidth={drawerWidth}
            />
        </>
    );
};

export default LoggedInHeader;
