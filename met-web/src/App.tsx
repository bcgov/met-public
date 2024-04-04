import React, { useEffect, useState } from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Will be available to use in all component
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
import { LanguageState } from 'reduxSlices/languageSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import i18n from './i18n';
import DocumentTitle from 'DocumentTitle';
import { Language } from 'constants/language';

interface Translations {
    [languageId: string]: { [key: string]: string };
}

const App = () => {
    const drawerWidth = 280;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);
    const pathSegments = window.location.pathname.split('/');
    const language: LanguageState = useAppSelector((state) => state.language);
    const basename = pathSegments[1].toLowerCase();
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    const [translations, setTranslations] = useState<Translations>({});

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
            if (pathSegments.length === 2) {
                const defaultLanguage = AppConfig.language.defaultLanguageId; // Set the default language here
                const defaultUrl = `/${basename}/${defaultLanguage}`;
                window.location.replace(defaultUrl);
            }
            return;
        }

        if (!basename && AppConfig.tenant.defaultTenant) {
            const defaultLanguage = AppConfig.language.defaultLanguageId; // Set the default language here
            const defaultUrl = `/${AppConfig.tenant.defaultTenant}/${defaultLanguage}`;
            window.location.replace(defaultUrl);
        }

        dispatch(loadingTenant(false));
    };

    const preloadTranslations = async () => {
        if (!tenant.id) {
            return;
        }

        try {
            const supportedLanguages = Object.values(Language);
            const translationPromises = supportedLanguages.map((languageId) => getTranslationFile(languageId));
            const translationFiles = await Promise.all(translationPromises);

            const translationsObj: Translations = {};

            translationFiles.forEach((file, index) => {
                if (file) {
                    translationsObj[supportedLanguages[index]] = file.default;
                }
            });

            setTranslations(translationsObj);
        } catch (error) {
            console.error('Error preloading translations:', error);
        }
    };

    const getTranslationFile = async (languageId: string) => {
        try {
            const translationFile = await import(`./locales/${languageId}/${tenant.id}.json`);
            return translationFile;
        } catch (error) {
            const defaultTranslationFile = await import(`./locales/${languageId}/default.json`);
            return defaultTranslationFile;
        }
    };

    useEffect(() => {
        preloadTranslations();
    }, [tenant.id]); // Preload translations when tenant id changes

    const loadTranslation = async () => {
        if (!tenant.id || !translations[language.id]) {
            return;
        }

        i18n.changeLanguage(language.id); // Set the language for react-i18next

        try {
            i18n.addResourceBundle(language.id, tenant.id, translations[language.id]);
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
    }, [language.id, translations]);

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
                <Routes>
                    <Route path="/:lang/*" element={<UnauthenticatedRoutes />} />
                </Routes>
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
                    backgroundColor: 'var(--bcds-surface-background-white)',
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
