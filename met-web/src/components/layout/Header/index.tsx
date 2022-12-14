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
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { ReactComponent as BCLogoLight } from 'assets/images/BritishColumbiaLogoLight.svg';
import { useAppSelector } from 'hooks';
import { Else, If, Then, When } from 'react-if';

const Header = ({ drawerWidth = 280 }) => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    return (
        <>
            <CssBaseline />
            <AppBar
                position={isLoggedIn ? 'fixed' : 'static'}
                color={isLoggedIn ? 'default' : 'primary'}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    color: isLoggedIn ? Palette.text.primary : '',
                }}
                data-testid="appbar-header"
            >
                <Toolbar>
                    <Box
                        component={isLoggedIn ? BCLogo : BCLogoLight}
                        sx={{
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '7em' },
                        }}
                        alt="British Columbia Logo"
                    />
                    {isMediumScreen ? (
                        <MetHeader1 sx={{ flexGrow: 1 }}>{isLoggedIn ? 'MET' : 'Login to MET'}</MetHeader1>
                    ) : (
                        <MetHeader2 sx={{ flexGrow: 1 }}>{isLoggedIn ? 'MET' : 'Login to MET'}</MetHeader2>
                    )}
                    <If condition={isLoggedIn}>
                        <Then>
                            <Button data-testid="button-header" color="inherit" onClick={() => UserService.doLogout()}>
                                Logout
                            </Button>
                        </Then>
                        <Else>
                            <Button color="inherit" onClick={() => UserService.doLogin()}>
                                Login
                            </Button>
                        </Else>
                    </If>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
            <When condition={isLoggedIn}>
                <SideNav
                    data-testid="sidenav-header"
                    isMediumScreen={isMediumScreen}
                    open={false}
                    drawerWidth={drawerWidth}
                />
            </When>
        </>
    );
};

export default Header;
