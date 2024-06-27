import React, { useEffect, useState, useContext } from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Will be available to use in all component
import './App.scss';
import {
    Route,
    BrowserRouter as Router,
    RouterProvider,
    Routes,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { AppConfig } from 'config';
import NoAccess from 'routes/NoAccess';
import { getTenant } from 'services/tenantService';
import NotFound from 'routes/NotFound';
import { TenantState, loadingTenant, saveTenant } from 'reduxSlices/tenantSlice';
import { LanguageState } from 'reduxSlices/languageSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import i18n from './i18n';
import DocumentTitle from 'DocumentTitle';
import { Languages } from 'constants/language';
import { AuthKeyCloakContext } from './components/auth/AuthKeycloakContext';
import { determinePathSegments, findTenantInPath } from './utils';
import { AuthenticatedLayout } from 'components/appLayouts/AuthenticatedLayout';
import { PublicLayout } from 'components/appLayouts/PublicLayout';

interface Translations {
    [languageId: string]: { [key: string]: string };
}

const App = () => {
    const drawerWidth = 280;
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);
    const pathSegments = determinePathSegments();
    const language: LanguageState = useAppSelector((state) => state.language);
    const basename = findTenantInPath();
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    const [translations, setTranslations] = useState<Translations>({});
    const { isAuthenticated } = useContext(AuthKeyCloakContext);

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
                    logoUrl: tenant.hero_image_url ?? '',
                    basename: appBaseName,
                    title: tenant.title,
                    contact_email: tenant.contact_email ?? '',
                    contact_name: tenant.contact_name ?? '',
                    description: tenant.description ?? '',
                    short_name: tenant.short_name,
                    hero_image_description: tenant.hero_image_description ?? '',
                    hero_image_credit: tenant.hero_image_credit ?? '',
                }),
            );
        } catch {
            dispatch(loadingTenant(false));
            console.error('Error occurred while fetching Tenant information');
        }
    };

    const loadTenant = () => {
        // Load default tenant if in a single tenant environment
        if (AppConfig.tenant.isSingleTenantEnvironment) {
            fetchTenant(AppConfig.tenant.defaultTenant);
            return;
        }

        const defaultTenant = AppConfig.tenant.defaultTenant;
        sessionStorage.setItem('languageId', AppConfig.language.defaultLanguageId);
        // Determine the appropriate URL to redirect
        const redirectToDefaultUrl = (base: string, isAuthenticated: boolean) => {
            const redirectUrl = `/${base}${isAuthenticated ? '/home' : ''}`;
            window.location.replace(redirectUrl);
        };

        if (basename) {
            fetchTenant(basename);
            // if admin dashboard url not set
            if (pathSegments.length < 2 && isAuthenticated) {
                redirectToDefaultUrl(basename, isAuthenticated);
            }
        } else if (defaultTenant) {
            fetchTenant(defaultTenant);
            redirectToDefaultUrl(defaultTenant, isAuthenticated);
        } else {
            dispatch(loadingTenant(false));
        }
    };

    const preloadTranslations = async () => {
        if (!tenant.id) {
            return;
        }
        try {
            const supportedLanguages: string[] = Object.values(Languages);
            const translationPromises = supportedLanguages.map((languageId) => getTranslationFile(languageId));
            const translationFiles = await Promise.all(translationPromises);

            const translationsObj: Translations = {};

            translationFiles.forEach((file, index) => {
                if (file) {
                    translationsObj[supportedLanguages[index]] = file.default;
                }
            });

            // Fetch the common.json file separately
            const commonTranslations = await getTranslationFile('common');
            if (commonTranslations) {
                translationsObj['common'] = commonTranslations.default;
            }

            setTranslations(translationsObj);
        } catch (error) {
            console.error('Error preloading translations:', error);
        }
    };

    const getTranslationFile = async (localeId: string) => {
        try {
            const translationFile = await import(`./locales/${localeId}.json`);
            return translationFile;
        } catch (error) {
            const defaultTranslationFile = await import(`./locales/en.json`);
            return defaultTranslationFile;
        }
    };

    useEffect(() => {
        preloadTranslations();
    }, [language.id, tenant.id]); // Preload translations when language id or tenant id changes

    const loadTranslation = async () => {
        if (!tenant.id || !translations[language.id]) {
            return;
        }

        i18n.changeLanguage(language.id); // Set the language for react-i18next

        try {
            // adding language based translation resources to default namespace 'default'. like en.json, fr.json etc
            i18n.addResourceBundle(language.id, 'default', translations[language.id]);
            // adding common translation resource file (common.json) to namespace 'common'
            i18n.addResourceBundle(language.id, 'common', translations['common']);

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

    if (!isAuthenticated) {
        const router = createBrowserRouter(
            [
                {
                    element: <PublicLayout />,
                    children: createRoutesFromElements(UnauthenticatedRoutes()),
                },
            ],
            { basename: `/${basename}` },
        );
        return <RouterProvider router={router} />;
    }

    if (roles.length === 0) {
        const router = createBrowserRouter(
            [
                {
                    element: <AuthenticatedLayout drawerWidth={0} />,
                    children: [
                        {
                            path: '*',
                            element: <NoAccess />,
                        },
                    ],
                },
            ],
            { basename: `/${basename}` },
        );
        return <RouterProvider router={router} />;
    }

    const router = createBrowserRouter(
        [
            {
                element: <AuthenticatedLayout drawerWidth={drawerWidth} />,
                children: createRoutesFromElements(AuthenticatedRoutes()),
                handle: {
                    crumb: () => ({ name: 'Dashboard', link: '/home' }),
                },
            },
        ],
        { basename: `/${basename}` },
    );

    return <RouterProvider router={router} />;
};
export default App;
