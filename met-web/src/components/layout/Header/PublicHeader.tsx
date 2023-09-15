import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { HeaderTitle } from 'components/common';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'styles/Theme';

const PublicHeader = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();

    const logoUrl = translate('common.logoUrl');
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: Palette.internalHeader.backgroundColor,
                    color: Palette.internalHeader.color,
                }}
            >
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
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    navigate('/');
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
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                navigate('/');
                            }}
                            alt="British Columbia Logo"
                        />
                    </When>
                    <HeaderTitle
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        {translate('header.title')}
                    </HeaderTitle>
                    <When condition={isLoggedIn}>
                        <Button color="inherit" onClick={() => UserService.doLogout()}>
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
