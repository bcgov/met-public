declare global {
    interface Window {
        _env_: {
            REACT_APP_API_URL: string;

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
        };
    }
}

const API_URL = window._env_.REACT_APP_API_URL || process.env.REACT_APP_API_URL;

// Formio Environment Variables
const FORMIO_PROJECT_URL = window._env_.REACT_APP_API_PROJECT_URL || process.env.REACT_APP_API_PROJECT_URL;
const FORMIO_API_URL = window._env_.REACT_APP_API_PROJECT_URL || process.env.REACT_APP_API_SERVER_URL;
const FORMIO_FORM_ID = window._env_.REACT_APP_FORM_ID || process.env.REACT_APP_FORM_ID;
const FORMIO_JWT_SECRET = window._env_.REACT_APP_FORMIO_JWT_SECRET || process.env.REACT_APP_FORMIO_JWT_SECRET;
const FORMIO_USER_RESOURCE_FORM_ID =
    window._env_.REACT_APP_USER_RESOURCE_FORM_ID || process.env.REACT_APP_USER_RESOURCE_FORM_ID;
const FORMIO_ANONYMOUS_USER =
    window._env_.REACT_APP_FORMIO_ANONYMOUS_USER || process.env.REACT_APP_FORMIO_ANONYMOUS_USER;
const FORMIO_ANONYMOUS_ID = window._env_.REACT_APP_ANONYMOUS_ID || process.env.REACT_APP_ANONYMOUS_ID;

// Keycloak Environment Variables
const KC_URL = window._env_.REACT_APP_KEYCLOAK_URL || process.env.REACT_APP_KEYCLOAK_URL;
const KC_CLIENT = window._env_.REACT_APP_KEYCLOAK_CLIENT || process.env.REACT_APP_KEYCLOAK_CLIENT;
const KC_REALM = window._env_.REACT_APP_KEYCLOAK_REALM || process.env.REACT_APP_KEYCLOAK_REALM;
const KC_ADMIN_ROLE = window._env_.REACT_APP_KEYCLOAK_ADMIN_ROLE || process.env.REACT_APP_KEYCLOAK_ADMIN_ROLE;

export const AppConfig = {
    apiUrl: API_URL,
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
        adminRole: KC_ADMIN_ROLE || 'admin',
    },
};