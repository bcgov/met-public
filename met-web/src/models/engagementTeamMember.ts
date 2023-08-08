import { Engagement } from './engagement';
import { createDefaultUser, User } from './user';

export type EngagementMembershipType = 1;

export const ENGAGEMENT_MEMBERSHIP_TYPE: { [x: string]: EngagementMembershipType } = {
    TEAM_MEMBER: 1,
};

export type MembershipStatus = 1 | 2 | 3;

export interface EngagementTeamMember {
    id: number;
    status: MembershipStatus;
    created_date: string;
    revoked_date: string | null;
    engagement_id: number;
    user_id: number;
    user: User;
    type: EngagementMembershipType;
}
export type MembershipStatusName = 'Active' | 'Inactive' | 'Revoked';

export const ENGAGEMENT_MEMBERSHIP_STATUS: { [x in MembershipStatusName]: MembershipStatus } = {
    Active: 1,
    Inactive: 2,
    Revoked: 3,
};

export const ENGAGEMENT_MEMBERSHIP_STATUS_NAME: { [x in MembershipStatus]: MembershipStatusName } = {
    1: 'Active',
    2: 'Inactive',
    3: 'Revoked',
};

export const initialDefaultTeamMember: EngagementTeamMember = {
    id: 0,
    status: 1,
    created_date: Date(),
    revoked_date: null,
    engagement_id: 0,
    user_id: 0,
    type: ENGAGEMENT_MEMBERSHIP_TYPE.TEAM_MEMBER,
    user: { ...createDefaultUser },
};

export interface UserEngagementsTable {
    added_by_user: User;
    engagement: Engagement;
    user: User;
    created_date: string;
}
