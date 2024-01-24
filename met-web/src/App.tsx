import React, { useEffect } from 'react';
import './App.scss';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
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
import NotFound from 'routes/NotFound';
import Footer from 'components/layout/Footer';
import { ZIndex } from 'styles/Theme';
import { TenantState, loadingTenant, saveTenant } from 'reduxSlices/tenantSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import i18n from './i18n';
import DocumentTitle from 'DocumentTitle';

const App = () => {
    const drawerWidth = 280;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);
    const pathSegments = window.location.pathname.split('/');
    const language = 'en'; // Default language is English, change as needed
    const basename = pathSegments[1].toLowerCase();
    const tenant: TenantState = useAppSelector((state) => state.tenant);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    useEffect(() => {
        sessionStorage.setItem('apiurl', String(AppConfig.apiUrl));
        loadTenant();
    }, [basename, AppConfig.apiUrl]);

    const fetchTenant = async (_basename: string) => {
        if (!_basename) {
            dispatch(loadingTenant(false));
            return;
        }

        try {
            const tenant = await getTenant(_basename);

            const appBaseName = !AppConfig.tenant.isSingleTenantEnvironment ? _basename : '';
            // To be used for API Requests and language translation
            sessionStorage.setItem('tenantId', _basename);
            // To be used for routing
            sessionStorage.setItem('basename', appBaseName);

            dispatch(
                saveTenant({
                    id: _basename,
                    name: tenant.name,
                    logoUrl: tenant.logo_url ?? '',
                    basename: appBaseName,
                }),
            );
        } catch {
            dispatch(loadingTenant(false));
            console.error('Error occurred while fetching Tenant information');
        }
    };

    const loadTenant = () => {
        if (AppConfig.tenant.isSingleTenantEnvironment) {
            fetchTenant(AppConfig.tenant.defaultTenant);
            return;
        }

        if (basename) {
            fetchTenant(basename);
            return;
        }

        if (!basename && AppConfig.tenant.defaultTenant) {
            window.location.replace(`/${AppConfig.tenant.defaultTenant}`);
        }

        dispatch(loadingTenant(false));
    };

    const getTranslationFile = async () => {
        try {
            const translationFile = await import(`./locales/${language}/${tenant.id}.json`);
            return translationFile;
        } catch (error) {
            const defaultTranslationFile = await import(`./locales/${language}/default.json`);
            return defaultTranslationFile;
        }
    };

    const loadTranslation = async () => {
        if (!tenant.id) {
            return;
        }

        i18n.changeLanguage(language); // Set the language for react-i18next

        try {
            const translationFile = await getTranslationFile();
            i18n.addResourceBundle(language, tenant.id, translationFile);
            dispatch(loadingTenant(false));
        } catch (error) {
            dispatch(loadingTenant(false));
            dispatch(
                openNotification({
                    text: 'Error while trying to load texts. Please try again later.',
                    severity: 'error',
                }),
            );
        }
    };

    useEffect(() => {
        loadTranslation();
    }, [tenant.id]);

    if (authenticationLoading || tenant.loading) {
        return <MidScreenLoader />;
    }

    if (!tenant.isLoaded && !tenant.loading) {
        return (
            <Router>
                <DocumentTitle />
                <Routes>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        );
    }

    if (!isLoggedIn) {
        return (
            <Router basename={tenant.basename}>
                <DocumentTitle />
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
            <Router basename={tenant.basename}>
                <DocumentTitle />
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
            <Router basename={tenant.basename}>
                <DocumentTitle />
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
        <Router basename={tenant.basename}>
            <DocumentTitle />
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
                }}
            >
                <Footer />
            </Box>
        </Router>
    );
};
export default App;
