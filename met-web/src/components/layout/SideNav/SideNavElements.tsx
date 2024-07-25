import { USER_ROLES } from 'services/userService/constants';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
    faHouse,
    faPeopleArrows,
    faSquarePollHorizontal,
    faTags,
    faGlobe,
    faUserGear,
    faHouseUser,
    faMessagePen,
} from '@fortawesome/pro-regular-svg-icons';
export interface Route {
    name: string;
    path: string;
    base: string;
    authenticated: boolean;
    allowedRoles: string[];
    icon?: IconDefinition;
    customComponent?: React.ReactNode;
}

export const Routes: Route[] = [
    { name: 'Home', path: '/home', base: '/', authenticated: false, allowedRoles: [], icon: faHouse },
    {
        name: 'Engagements',
        path: '/engagements',
        base: '/engagements',
        authenticated: false,
        allowedRoles: [],
        icon: faPeopleArrows,
    },
    {
        name: 'Surveys',
        path: '/surveys',
        base: '/surveys',
        authenticated: false,
        allowedRoles: [],
        icon: faSquarePollHorizontal,
    },
    {
        name: 'Metadata',
        path: '/metadatamanagement',
        base: '/metadatamanagement',
        authenticated: true,
        allowedRoles: [USER_ROLES.MANAGE_METADATA],
        icon: faTags,
    },
    {
        name: 'Languages',
        path: '/languages',
        base: 'languages',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_LANGUAGES],
        icon: faGlobe,
    },
    {
        name: 'User Admin',
        path: '/usermanagement',
        base: 'usermanagement',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_USERS],
        icon: faUserGear,
    },
    {
        name: 'Tenant Admin',
        path: '/tenantadmin',
        base: 'tenantadmin',
        authenticated: true,
        allowedRoles: [USER_ROLES.SUPER_ADMIN],
        icon: faHouseUser,
    },
    {
        name: 'MET Feedback',
        path: '/feedback',
        base: 'feedback',
        authenticated: true,
        allowedRoles: [USER_ROLES.VIEW_FEEDBACKS],
        icon: faMessagePen,
    },
];
