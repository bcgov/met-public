import { USER_ROLES } from 'services/userService/constants';

interface Route {
    name: string;
    path: string;
    base: string;
    authenticated: boolean;
    allowedRoles: string[];
}

export const Routes: Route[] = [
    { name: 'Home', path: '/', base: '/', authenticated: false, allowedRoles: [] },
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
        name: 'Metadata Management',
        path: '/metadatamanagement',
        base: '/metadatamanagement',
        authenticated: false,
        allowedRoles: [],
    },
    {
        name: 'User Management',
        path: '/usermanagement',
        base: 'usermanagement',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_USERS],
    },
    {
        name: 'Feedback Tool',
        path: '/feedback',
        base: 'feedback',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_FEEDBACKS],
    },
];
