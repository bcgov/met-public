import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import LanguageSelector from 'components/common/LanguageSelector';
import { LanguageContext } from 'components/common/LanguageContext';
import { TenantState } from 'reduxSlices/tenantSlice';
import { Header1 } from 'components/common/Typography';

const PublicHeader = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();
    const { engagementViewMounted, availableEngagementTranslations } = useContext(LanguageContext);
    const tenant: TenantState = useAppSelector((state) => state.tenant);

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
                    <Box
                        component={BCLogo}
                        sx={{
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            navigate(`/`);
                        }}
                        alt={translate('common.defaultBCText')}
                    />
                    <Header1
                        component={'p'}
                        sx={{ flexGrow: 1, cursor: 'pointer', margin: 0 }}
                        onClick={() => {
                            navigate(`/`);
                        }}
                    >
                        {headerTitle}
                    </Header1>
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
