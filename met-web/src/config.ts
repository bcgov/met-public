declare global {
    interface Window {
        _env_: {
            [key: string]: string;
        };
    }
}

const getEnv = (key: string, defaultValue = '') => {
    return window._env_[key] ?? process.env[key] ?? defaultValue;
};

const API_URL = getEnv('REACT_APP_API_URL');
const PUBLIC_URL = getEnv('REACT_APP_PUBLIC_URL');
const REACT_APP_ANALYTICS_API_URL = getEnv('REACT_APP_ANALYTICS_API_URL');

// Keycloak Environment Variables
const KC_URL = getEnv('REACT_APP_KEYCLOAK_URL');
const KC_CLIENT = getEnv('REACT_APP_KEYCLOAK_CLIENT');
const KC_REALM = getEnv('REACT_APP_KEYCLOAK_REALM');
const KC_ADMIN_ROLE = getEnv('REACT_APP_KEYCLOAK_ADMIN_ROLE');

// tenant conifg
const IS_SINGLE_TENANT_ENVIRONMENT = getEnv('REACT_APP_IS_SINGLE_TENANT_ENVIRONMENT', 'true') === 'true';
const DEFAULT_TENANT = getEnv('REACT_APP_DEFAULT_TENANT');
const DEFAULT_LANGUAGE_ID = getEnv('REACT_APP_DEFAULT_LANGUAGE_ID');

export const AppConfig = {
    apiUrl: API_URL,
    analyticsApiUrl: REACT_APP_ANALYTICS_API_URL,
    publicUrl: PUBLIC_URL,
    keycloak: {
        url: KC_URL || '',
        clientId: KC_CLIENT || '',
        realm: KC_REALM || '',
        adminRole: KC_ADMIN_ROLE || 'super_admin',
    },
    tenant: {
        isSingleTenantEnvironment: IS_SINGLE_TENANT_ENVIRONMENT,
        defaultTenant: DEFAULT_TENANT,
    },
    language: {
        defaultLanguageId: DEFAULT_LANGUAGE_ID || 'en',
    },
};
