import './App.scss';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch, useAppTranslation } from './hooks';
import { MidScreenLoader, MobileToolbar } from './components/common';
import { Box, Container, useMediaQuery, Theme, Toolbar } from '@mui/material';
import InternalHeader from './components/layout/Header/InternalHeader';
import PublicHeader from './components/layout/Header/PublicHeader';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/feedback/FeedbackModal';
import { AppConfig } from 'config';
import NoAccess from 'routes/NoAccess';
import { getTenant } from 'services/tenantService';
import { DEFAULT_TENANT } from './constants';
import NotFound from 'routes/NotFound';
import Footer from 'components/layout/Footer';
import { ZIndex } from 'styles/Theme';
import { TenantState, loadingTenant, saveTenant } from 'reduxSlices/tenantSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import i18n from './i18n';

const App = () => {
    const drawerWidth = 280;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);
    const pathSegments = window.location.pathname.split('/');
    const basename = pathSegments[1];

    const tenant: TenantState = useAppSelector((state) => state.tenant);
    const { t: translate } = useAppTranslation();

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    useEffect(() => {
        sessionStorage.setItem('apiurl', String(AppConfig.apiUrl));
        fetchTenant();
    }, [basename, AppConfig.apiUrl]);

    const redirectToDefaultTenant = () => {
        console.log('Redirecting to default tenant.');
        if (!window.location.toString().includes(DEFAULT_TENANT)) {
            window.location.replace(`/${DEFAULT_TENANT}/`);
        }
    };

    const fetchTenant = async () => {
        if (!basename) {
            return redirectToDefaultTenant();
        }

        try {
            const tenant = await getTenant(basename);

            localStorage.setItem('tenantId', basename);
            dispatch(
                saveTenant({
                    name: tenant.name,
                    logoUrl: tenant.logo_url || '',
                    basename: basename,
                }),
            );
        } catch {
            dispatch(loadingTenant(false));
            console.error('Error occurred while fetching Tenant information');
        }
    };

    const loadTranslation = async () => {
        if (!tenant.basename) {
            return;
        }

        const language = 'en'; // Default language is English, change as needed
        i18n.changeLanguage(language); // Set the language for react-i18next

        try {
            const translationFile = await import(`./locales/${language}/${basename}.json`);
            i18n.addResourceBundle(language, basename, translationFile);
            dispatch(loadingTenant(false));
        } catch (error) {
            dispatch(openNotification({ text: translate('landing.error.loadTranslation'), severity: 'error' }));
        }
    };

    useEffect(() => {
        loadTranslation();
    }, [tenant.basename]);

    if (authenticationLoading || tenant.loading) {
        return <MidScreenLoader />;
    }

    if (!tenant) {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        );
    }

    if (!isLoggedIn) {
        return (
            <Router basename={basename}>
                <PageViewTracker />
                <Notification />
                <NotificationModal />
                <PublicHeader />
                <UnauthenticatedRoutes />
                <FeedbackModal />
                <Footer />
            </Router>
        );
    }

    if (roles.length === 0) {
        return (
            <Router basename={basename}>
                <PublicHeader />
                <Container>
                    <NoAccess />
                </Container>
                <FeedbackModal />
                <Footer />
            </Router>
        );
    }

    if (!isMediumScreen) {
        return (
            <Router basename={basename}>
                <InternalHeader />
                <Container>
                    <MobileToolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                    <Footer />
                </Container>
            </Router>
        );
    }

    return (
        <Router basename={basename}>
            <Box sx={{ display: 'flex' }}>
                <InternalHeader drawerWidth={drawerWidth} />
                <Notification />
                <NotificationModal />
                <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)`, marginTop: '17px' }}>
                    <Toolbar />
                    <AuthenticatedRoutes />
                    <FeedbackModal />
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: 'white',
                    zIndex: ZIndex.footer,
                    position: 'relative',
                    paddingTop: '5em',
                }}
            >
                <Footer />
            </Box>
        </Router>
    );
};
export default App;
