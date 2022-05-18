interface UserDetail {
  sub?: string;
  email_verified?: boolean;
  preferred_username?: string;
}

interface UserAuthentication {
  authenticated: boolean;
  loading: boolean;
}

interface UserState {
  bearerToken: string | undefined;
  roles: string[];
  userDetail: UserDetail;
  authentication: UserAuthentication;
  currentPage: string;
  isAuthorized: boolean;
}

interface EngagementState {
  allEngagements: Engagement[];
}

interface IRootState {
  user: UserState;
  engagement: EngagementState;
}
