import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import { MetHeader1, MetHeader2 } from 'components/common';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoLight.svg';
import { Unless, When } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import { useNavigate } from 'react-router-dom';

const PublicHeader = () => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();

    const logoUrl = translate('common.logoUrl');
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
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
                                height: '5em',
                                width: { xs: '7em', md: '15em' },
                                marginRight: { xs: '1em', md: '3em' },
                            }}
                            alt="British Columbia Logo"
                        />
                    </When>
                    <When condition={isMediumScreen}>
                        <MetHeader1 sx={{ flexGrow: 1 }}>{translate('header.title')}</MetHeader1>
                    </When>
                    <Unless condition={isMediumScreen}>
                        <MetHeader2 sx={{ flexGrow: 1 }}>{translate('header.title')}</MetHeader2>
                    </Unless>
                    <When condition={isLoggedIn}>
                        <Button color="inherit" onClick={() => UserService.doLogout(() => navigate('/'))}>
                            Logout
                        </Button>
                    </When>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
        </Box>
    );
};

export default PublicHeader;
