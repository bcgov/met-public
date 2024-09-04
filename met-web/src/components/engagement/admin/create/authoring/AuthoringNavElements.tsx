import { USER_ROLES } from 'services/userService/constants';
import { TenantState } from 'reduxSlices/tenantSlice';

export interface AuthoringRoute {
    name: string;
    path: string;
    base: string;
    authenticated: boolean;
    allowedRoles: string[];
    required?: boolean;
}

export const getAuthoringRoutes = (engagementId: number, tenant: TenantState): AuthoringRoute[] => [
    {
        name: 'Engagement Home',
        path: `/${tenant.id}/engagements/${engagementId}/details/authoring`,
        base: `/${tenant.id}/engagements`,
        authenticated: false,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Hero Banner',
        path: `/engagements/${engagementId}/details/authoring/banner`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Summary',
        path: `/engagements/${engagementId}/details/authoring/summary`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Details',
        path: `/engagements/${engagementId}/details/authoring/details`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Provide Feedback',
        path: `/engagements/${engagementId}/details/authoring/feedback`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'View Results',
        path: `/engagements/${engagementId}/details/authoring/results`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
    {
        name: 'Subscribe',
        path: `/engagements/${engagementId}/details/authoring/subscribe`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
    {
        name: 'More Engagements',
        path: `/engagements/${engagementId}/details/authoring/more`,
        base: `/engagements`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
];
