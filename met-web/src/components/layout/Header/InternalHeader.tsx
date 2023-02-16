import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme, IconButton } from '@mui/material';
import SideNav from '../SideNav/SideNav';
import CssBaseline from '@mui/material/CssBaseline';
import { Palette } from 'styles/Theme';
import EnvironmentBanner from './EnvironmentBanner';
import { MetHeader1, MetHeader2 } from 'components/common';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import MenuIcon from '@mui/icons-material/Menu';

const InternalHeader = ({ drawerWidth = 280 }) => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);
    return (
        <>
            <AppBar
                position="fixed"
                color="default"
                sx={{
                    zIndex: (theme: Theme) => (isMediumScreen ? theme.zIndex.drawer + 1 : theme.zIndex.drawer),
                    color: Palette.text.primary,
                }}
                data-testid="appbar-header"
            >
                <CssBaseline />
                <Toolbar>
                    <When condition={!isMediumScreen}>
                        <IconButton
                            component={MenuIcon}
                            color="info"
                            sx={{
                                height: '2em',
                                width: '2em',
                                marginRight: { xs: '1em' },
                            }}
                            onClick={() => setOpen(!open)}
                        />
                    </When>
                    <Box
                        component={BCLogo}
                        sx={{
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                        }}
                        alt="British Columbia Logo"
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
                setOpen={setOpen}
                data-testid="sidenav-header"
                isMediumScreen={isMediumScreen}
                open={open}
                drawerWidth={drawerWidth}
            />
        </>
    );
};

export default InternalHeader;
