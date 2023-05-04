import { createDefaultUser, User } from './user';

export type EngagementMembershipType = 1;

export const ENGAGEMENT_MEMBERSHIP_TYPE: { [x: string]: EngagementMembershipType } = {
    TEAM_MEMBER: 1,
};
export interface EngagementTeamMember {
    id: number;
    status: string;
    created_date: string;
    engagement_id: number;
    user_id: number;
    user: User;
    type: EngagementMembershipType;
}

export const initialDefaultTeamMember: EngagementTeamMember = {
    id: 0,
    status: '',
    created_date: Date(),
    engagement_id: 0,
    user_id: 0,
    type: ENGAGEMENT_MEMBERSHIP_TYPE.TEAM_MEMBER,
    user: { ...createDefaultUser },
};
