import { SCOPES } from 'components/permissionsGate/PermissionMaps';

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
        authenticated: true,
        allowedRoles: [SCOPES.viewEngagement, SCOPES.viewAssignedEngagements],
    },
    { name: 'Surveys', path: '/surveys', base: '/surveys', authenticated: true, allowedRoles: [SCOPES.viewSurveys] },
    {
        name: 'User Management',
        path: '/usermanagement',
        base: 'usermanagement',
        authenticated: true,
        allowedRoles: [SCOPES.viewUsers],
    },
    {
        name: 'Feedback Tool',
        path: '/feedback',
        base: 'feedback',
        authenticated: true,
        allowedRoles: [SCOPES.viewFeedbacks],
    },
];
