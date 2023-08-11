import { User } from 'models/user';

export interface UserDetail {
    sub?: string;
    email_verified?: boolean;
    preferred_username?: string;
    user?: User;
    groups?: string[];
}

export interface UserAuthentication {
    authenticated: boolean;
    loading: boolean;
}

export interface UserState {
    bearerToken: string | undefined;
    roles: string[];
    userDetail: UserDetail;
    authentication: UserAuthentication;
    currentPage: string;
    isAuthorized: boolean;
    assignedEngagements: number[];
}
