export type UserGroup = 'EAO_IT_ADMIN' | 'EAO_IT_VIEWER' | 'EAO_TEAM_MEMBER' | 'EAO_REVIEWER';

export const USER_GROUP: { [x: string]: { value: UserGroup; label: string } } = {
    ADMIN: {
        value: 'EAO_IT_ADMIN',
        label: 'Administrator',
    },
    VIEWER: {
        value: 'EAO_IT_VIEWER',
        label: 'Viewer',
    },
    TEAM_MEMBER: {
        value: 'EAO_TEAM_MEMBER',
        label: 'Team Member',
    },
    REVIEWER: {
        value: 'EAO_REVIEWER',
        label: 'Reviewer',
    },
};

export interface User {
    contact_number: string;
    created_date: string;
    description: string;
    email_address: string;
    external_id: string;
    first_name: string;
    groups: string[];
    id: number;
    last_name: string;
    updated_date: string;
    roles: string[];
    main_group: string;
    username: string;
    status_id: number;
}

export const USER_STATUS: { [x: string]: { value: number; label: string } } = {
    ACTIVE: {
        value: 1,
        label: 'Active',
    },
    INACTIVE: {
        value: 2,
        label: 'Deactivated',
    },
};

export const createDefaultUser: User = {
    id: 0,
    contact_number: '',
    description: '',
    email_address: '',
    external_id: '',
    groups: [''],
    first_name: '',
    last_name: '',
    updated_date: Date(),
    created_date: Date(),
    roles: [],
    username: '',
    main_group: '',
    status_id: 0,
};
