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
import { HeaderTitle } from 'components/common';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderProps } from './types';
import { useNavigate } from 'react-router-dom';
import { useAppTranslation } from 'hooks';

const InternalHeader = ({ drawerWidth = 280 }: HeaderProps) => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();

    const logoUrl = translate('common.logoUrl');
    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme: Theme) => (isMediumScreen ? theme.zIndex.drawer + 1 : theme.zIndex.drawer),
                    backgroundColor: Palette.internalHeader.backgroundColor,
                    color: Palette.internalHeader.color,
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
                    <When condition={logoUrl && !imageError}>
                        <Box
                            sx={{
                                backgroundImage: logoUrl,
                                height: '5em',
                                width: { xs: '7em', md: '15em' },
                                marginRight: { xs: '1em', md: '3em' },
                            }}
                        >
                            <img
                                src={logoUrl}
                                alt="Site Logo"
                                style={{
                                    objectFit: 'cover',
                                    height: '5em',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    navigate('/home');
                                }}
                                onError={(_e) => {
                                    setImageError(true);
                                }}
                            />
                        </Box>
                    </When>
                    <When condition={!logoUrl || imageError}>
                        <Box
                            component={BCLogo}
                            sx={{
                                cursor: 'pointer',
                                height: '5em',
                                width: { xs: '7em', md: '15em' },
                                marginRight: { xs: '1em', md: '3em' },
                            }}
                            onClick={() => {
                                navigate('/home');
                            }}
                            alt="British Columbia Logo"
                        />
                    </When>
                    {isMediumScreen ? (
                        <HeaderTitle
                            onClick={() => {
                                navigate('/home');
                            }}
                            sx={{ flexGrow: 1, cursor: 'pointer' }}
                        >
                            {translate('header.title')}
                        </HeaderTitle>
                    ) : (
                        <HeaderTitle
                            onClick={() => {
                                navigate('/home');
                            }}
                            sx={{ flexGrow: 1, cursor: 'pointer' }}
                        >
                            {translate('header.smallTitle')}
                        </HeaderTitle>
                    )}
                    <Button
                        data-testid="button-header"
                        sx={{
                            color: Palette.internalHeader.color,
                        }}
                        onClick={() => UserService.doLogout()}
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
