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
        path: `/${tenant.id}/engagements/${engagementId}/view`,
        base: `/${tenant.id}/engagements/${engagementId}/view`,
        authenticated: false,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Hero Banner',
        path: `/engagements/${engagementId}/authoring/banner`,
        base: `/engagements/${engagementId}/authoring/banner`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Summary',
        path: `/engagements/${engagementId}/authoring/summary`,
        base: `/engagements/${engagementId}/authoring/summary`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Details',
        path: `/engagements/${engagementId}/authoring/details`,
        base: `/engagements/${engagementId}/authoring/details`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'Provide Feedback',
        path: `/engagements/${engagementId}/authoring/feedback`,
        base: `/engagements/${engagementId}/authoring/feedback`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: true,
    },
    {
        name: 'View Results',
        path: `/engagements/${engagementId}/authoring/results`,
        base: `/engagements/${engagementId}/authoring/results`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
    {
        name: 'Subscribe',
        path: `/engagements/${engagementId}/authoring/subscribe`,
        base: `/engagements/${engagementId}/authoring/subscribe`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
    {
        name: 'More Engagements',
        path: `/engagements/${engagementId}/authoring/more`,
        base: `/engagements/${engagementId}/authoring/more`,
        authenticated: true,
        allowedRoles: [USER_ROLES.EDIT_ENGAGEMENT],
        required: false,
    },
];
