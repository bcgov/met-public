import React, { useEffect, useState, useContext } from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Will be available to use in all component
import './App.scss';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { AppConfig } from 'config';
import { getTenant } from 'services/tenantService';
import { TenantState, loadingTenant, saveTenant } from 'reduxSlices/tenantSlice';
import { LanguageState, loadingLanguage } from 'reduxSlices/languageSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import i18n from './i18n';
import { Languages } from 'constants/language';
import { AuthKeyCloakContext } from './components/auth/AuthKeycloakContext';
import { determinePathSegments, findTenantInPath } from './utils';
import { authenticatedRootLoader } from 'routes/AuthenticatedRootRouteLoader';
const MidScreenLoaderLazy = React.lazy(() =>
    import('components/common').then((module) => ({ default: module.MidScreenLoader })),
);

interface Translations {
    [languageId: string]: { [key: string]: string };
}

const App = () => {
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
                    heroImageUrl: tenant.hero_image_url ?? '',
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
            dispatch(loadingTenant(false));
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
        try {
            const fallbackLanguages = new Set<string>();
            if (AppConfig.language.defaultLanguageId) {
                fallbackLanguages.add(AppConfig.language.defaultLanguageId);
            }
            if (language.id) {
                fallbackLanguages.add(language.id);
            }

            const languagesToLoad = tenant.id ? Object.values(Languages) : Array.from(fallbackLanguages);

            const translationEntries = await Promise.all(
                languagesToLoad.map(async (languageId) => {
                    const file = await getTranslationFile(languageId);
                    return [languageId, file] as const;
                }),
            );

            const translationsObj: Translations = {};
            translationEntries.forEach(([languageId, file]) => {
                if (file) {
                    translationsObj[languageId] = file.default;
                }
            });

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
        } catch {
            const defaultTranslationFile = await import(`./locales/en.json`);
            return defaultTranslationFile;
        }
    };

    const loadTranslation = async () => {
        const preferredLanguageId = translations[language.id] ? language.id : AppConfig.language.defaultLanguageId;

        if (!preferredLanguageId || !translations[preferredLanguageId]) {
            return;
        }

        i18n.changeLanguage(preferredLanguageId); // Set the language for react-i18next

        try {
            // adding language based translation resources to default namespace 'default'. like en.json, fr.json etc
            i18n.addResourceBundle(preferredLanguageId, 'default', translations[preferredLanguageId]);
            // adding common translation resource file (common.json) to namespace 'common'
            if (translations['common']) {
                i18n.addResourceBundle(preferredLanguageId, 'common', translations['common']);
            }

            dispatch(loadingLanguage(false));
        } catch {
            dispatch(loadingLanguage(false));
            dispatch(
                openNotification({
                    text: 'Error while trying to load texts. Please try again later.',
                    severity: 'error',
                }),
            );
        }
    };

    useEffect(() => {
        preloadTranslations();
    }, [language.id, tenant.id]); // Preload translations when language id or tenant id changes

    useEffect(() => {
        loadTranslation();
    }, [language.id, translations]);

    if (authenticationLoading || tenant.loading || language.loading) {
        return <MidScreenLoaderLazy />;
    }

    // If the tenant has failed to load, show the Not Found page.
    if (!tenant.id) {
        const router = createBrowserRouter(
            [
                {
                    path: '/*',
                    lazy: () => import('routes/NotFound').then((module) => ({ Component: module.default })),
                },
            ],
            { basename: `/${basename}` },
        );
        return <RouterProvider router={router} />;
    }

    // Otherwise, if the user is not authenticated, show the public layout.
    if (!isAuthenticated) {
        const router = createBrowserRouter(
            createRoutesFromElements(UnauthenticatedRoutes as Parameters<typeof createRoutesFromElements>[0]),
            {
                basename: `/${basename}`,
            },
        );
        return <RouterProvider router={router} />;
    }

    // Otherwise, if the user is authenticated but does not have a role, display the admin area with no access to children pages.
    if (roles.length === 0) {
        const router = createBrowserRouter(
            [
                {
                    lazy: () => {
                        return Promise.all([
                            import('routes/AuthenticatedRootRouteLoader'),
                            import('components/appLayouts/AuthenticatedLayout'),
                        ]).then(([loaderModule, layoutModule]) => ({
                            Component: layoutModule.default,
                            loader: loaderModule.authenticatedRootLoader,
                        }));
                    },
                    children: [
                        {
                            path: '*',
                            lazy: () => import('routes/NoAccess').then((module) => ({ Component: module.default })),
                        },
                    ],
                    loader: authenticatedRootLoader,
                    id: 'authenticated-root',
                },
            ],
            { basename: `/${basename}` },
        );
        return <RouterProvider router={router} />;
    }

    // Otherwise, display the admin area.
    const router = createBrowserRouter(
        createRoutesFromElements(AuthenticatedRoutes as Parameters<typeof createRoutesFromElements>[0]),
        {
            basename: `/${basename}`,
        },
    );

    return <RouterProvider router={router} />;
};
export default App;
