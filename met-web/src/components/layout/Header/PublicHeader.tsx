import React, { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { HeaderTitleOld } from 'components/common';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import LanguageSelector from 'components/common/LanguageSelector';
import { LanguageContext } from 'components/common/LanguageContext';
import { TenantState } from 'reduxSlices/tenantSlice';
import { te } from 'date-fns/locale';

const PublicHeader = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const language = sessionStorage.getItem('languageId');
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();
    const { engagementViewMounted, availableEngagementTranslations } = useContext(LanguageContext);
    const tenant: TenantState = useAppSelector((state) => state.tenant);

    const logoUrl = tenant.logoUrl;
    const headerTitle = tenant.title;

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
                                alt={translate('common.defaultText')}
                                style={{
                                    objectFit: 'cover',
                                    height: '5em',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    navigate(`/${language}`);
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
                                navigate(`/${language}`);
                            }}
                            alt={translate('common.defaultBCText')}
                        />
                    </When>
                    <HeaderTitleOld
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => {
                            navigate(`/${language}`);
                        }}
                    >
                        {headerTitle}
                    </HeaderTitleOld>
                    <When condition={isLoggedIn}>
                        <Button color="inherit" onClick={() => UserService.doLogout()}>
                            {translate('common.logout')}
                        </Button>
                    </When>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {engagementViewMounted && availableEngagementTranslations.length > 0 && <LanguageSelector />}
                    </Box>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
        </Box>
    );
};

export default PublicHeader;
