import { USER_ROLES } from 'services/userService/constants';

export interface Route {
    name: string;
    path: string;
    base: string;
    authenticated: boolean;
    allowedRoles: string[];
}

export const Routes: Route[] = [
    { name: 'Home', path: '/home', base: '/', authenticated: false, allowedRoles: [] },
    {
        name: 'Engagements',
        path: '/engagements',
        base: '/engagements',
        authenticated: false,
        allowedRoles: [],
    },
    {
        name: 'Surveys',
        path: '/surveys',
        base: '/surveys',
        authenticated: false,
        allowedRoles: [],
    },
    {
        name: 'Metadata',
        path: '/metadatamanagement',
        base: '/metadatamanagement',
        authenticated: true,
        allowedRoles: [USER_ROLES.MANAGE_METADATA],
    },
    {
        name: 'Languages',
        path: '/languages',
        base: 'languages',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_LANGUAGES],
    },
    {
        name: 'User Admin',
        path: '/usermanagement',
        base: 'usermanagement',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_USERS],
    },
    {
        name: 'Tenant Admin',
        path: '/tenantadmin',
        base: 'tenantadmin',
        authenticated: true,
        allowedRoles: [USER_ROLES.SUPER_ADMIN],
    },
    {
        name: 'MET Feedback',
        path: '/feedback',
        base: 'feedback',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_FEEDBACKS],
    },
];
