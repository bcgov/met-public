import { hasKey } from 'utils';
declare global {
    interface Window {
        _env_: {
            REACT_APP_API_URL: string;
            REACT_APP_PUBLIC_URL: string;
            REACT_APP_REDASH_PUBLIC_URL: string;
            REACT_APP_REDASH_COMMENTS_PUBLIC_URL: string;

            // Analytics
            REACT_APP_ANALYTICS_API_URL: string;

            // Formio
            REACT_APP_API_PROJECT_URL: string;
            REACT_APP_FORM_ID: string;
            REACT_APP_FORMIO_JWT_SECRET: string;
            REACT_APP_USER_RESOURCE_FORM_ID: string;
            REACT_APP_FORMIO_ANONYMOUS_USER: string;
            REACT_APP_ANONYMOUS_ID: string;

            // Keycloak
            REACT_APP_KEYCLOAK_URL: string;
            REACT_APP_KEYCLOAK_CLIENT: string;
            REACT_APP_KEYCLOAK_REALM: string;
            REACT_APP_KEYCLOAK_ADMIN_ROLE: string;

            //tenant
            REACT_APP_IS_SINGLE_TENANT_ENVIRONMENT: string;
            REACT_APP_DEFAULT_TENANT: string;
            REACT_APP_DEFAULT_LANGUAGE_ID: string;
        };
    }
}

const getEnv = (key: string, defaultValue = '') => {
    if (hasKey(window._env_, key)) {
        return window._env_[key];
    } else return process.env[key] || defaultValue;
};

// adding localStorage to access the MET API from external sources(eg: web-components)
const API_URL = localStorage.getItem('met-api-url') || getEnv('REACT_APP_API_URL');
const PUBLIC_URL = localStorage.getItem('met-public-url') || getEnv('REACT_APP_PUBLIC_URL');

// adding localStorage to access the MET Analytics API from external sources(eg: web-components)
const REACT_APP_ANALYTICS_API_URL = localStorage.getItem('analytics-api-url') || getEnv('REACT_APP_ANALYTICS_API_URL');

// Formio Environment Variables
const FORMIO_PROJECT_URL = getEnv('REACT_APP_FORMIO_PROJECT_URL');
const FORMIO_API_URL = getEnv('REACT_APP_FORMIO_PROJECT_URL');
const FORMIO_FORM_ID = getEnv('REACT_APP_FORM_ID');
const FORMIO_JWT_SECRET = getEnv('REACT_APP_FORMIO_JWT_SECRET');
const FORMIO_USER_RESOURCE_FORM_ID = getEnv('REACT_APP_USER_RESOURCE_FORM_ID');
const FORMIO_ANONYMOUS_USER = getEnv('REACT_APP_FORMIO_ANONYMOUS_USER');
const FORMIO_ANONYMOUS_ID = getEnv('REACT_APP_FORMIO_ANONYMOUS_ID');

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
    formio: {
        projectUrl: FORMIO_PROJECT_URL,
        apiUrl: FORMIO_API_URL,
        formId: FORMIO_FORM_ID,
        anonymousId: FORMIO_ANONYMOUS_ID || '',
        anonymousUser: FORMIO_ANONYMOUS_USER || 'anonymous',
        userResourceFormId: FORMIO_USER_RESOURCE_FORM_ID,
        // TODO: potentially sensitive information, should be stored somewhere else?
        jwtSecret: FORMIO_JWT_SECRET || '',
    },
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
