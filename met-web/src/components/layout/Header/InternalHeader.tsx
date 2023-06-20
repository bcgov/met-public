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
import { HeaderProps } from './types';
import { useNavigate } from 'react-router-dom';

const InternalHeader = ({ tenant, drawerWidth = 280 }: HeaderProps) => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
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
                    <When condition={tenant.logo_url && !imageError}>
                        <Box
                            sx={{
                                backgroundImage: tenant.logo_url,
                                height: '5em',
                                width: { xs: '7em', md: '15em' },
                                marginRight: { xs: '1em', md: '3em' },
                            }}
                        >
                            <img
                                src={tenant.logo_url}
                                alt="Site Logo"
                                style={{
                                    objectFit: 'cover',
                                    height: '5em',
                                    width: '100%',
                                }}
                                onError={(_e) => {
                                    setImageError(true);
                                }}
                            />
                        </Box>
                    </When>
                    <When condition={!tenant.logo_url || imageError}>
                        <Box
                            component={BCLogo}
                            sx={{
                                height: '5em',
                                width: { xs: '7em', md: '15em' },
                                marginRight: { xs: '1em', md: '3em' },
                            }}
                            alt="British Columbia Logo"
                        />
                    </When>
                    {isMediumScreen ? (
                        <MetHeader1 sx={{ flexGrow: 1 }}>{tenant.title}</MetHeader1>
                    ) : (
                        <MetHeader2 sx={{ flexGrow: 1 }}>{tenant.title}</MetHeader2>
                    )}
                    <Button
                        data-testid="button-header"
                        color="inherit"
                        onClick={() => UserService.doLogout(() => navigate('/'))}
                    >
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
