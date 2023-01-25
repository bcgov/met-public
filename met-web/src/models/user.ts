export type UserGroup = 'EAO_IT_ADMIN' | 'EAO_IT_VIEWER';

export const USER_GROUP: { [x: string]: { value: UserGroup; label: string } } = {
    ADMIN: {
        value: 'EAO_IT_ADMIN',
        label: 'Administrator',
    },
    VIEWER: {
        value: 'EAO_IT_VIEWER',
        label: 'Viewer',
    },
};

export interface User {
    contact_number: string;
    created_date: string;
    description: string;
    email_id: string;
    external_id: string;
    first_name: string;
    groups: string;
    id: number;
    last_name: string;
    updated_date: string;
    status: string;
    access_type: string;
    roles: string[];
    username: string;
}

export const initialDefaultUser: User = {
    id: 0,
    contact_number: '',
    description: '',
    email_id: '',
    external_id: '',
    groups: '',
    first_name: '',
    last_name: '',
    updated_date: Date(),
    created_date: Date(),
    status: '',
    access_type: '',
    roles: [],
    username: '',
};
