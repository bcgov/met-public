export interface UserDetail {
    sub?: string;
    email_verified?: boolean;
    preferred_username?: string;
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
}

export interface EngagementState {
    allEngagements: Engagement[];
}

export interface IRootState {
    user: UserState;
    engagement: EngagementState;
}
