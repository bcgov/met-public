import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { EngagementTeamMember } from 'models/engagementTeamMember';

interface GetTeamMembersParams {
    engagement_id: number;
}
export const getTeamMembers = async ({ engagement_id }: GetTeamMembersParams): Promise<EngagementTeamMember[]> => {
    const url = replaceUrl(Endpoints.EngagementTeamMembers.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<EngagementTeamMember[]>(url);
    return responseData.data ?? [];
};

interface TeamMemberAddProps {
    user_id?: string;
    engagement_id?: number;
}
export const addTeamMemberToEngagement = async ({
    user_id,
    engagement_id,
}: TeamMemberAddProps): Promise<EngagementTeamMember> => {
    const url = replaceUrl(Endpoints.EngagementTeamMembers.CREATE, 'engagement_id', String(engagement_id));
    const responseData = await http.PostRequest<EngagementTeamMember>(url, { user_id });
    return responseData.data;
};

interface GetMembershipsByUserParams {
    user_external_id?: string;
    include_engagement_details?: boolean;
    include_revoked?: boolean;
}
export const getMembershipsByUser = async ({
    user_external_id,
    include_engagement_details,
    include_revoked,
}: GetMembershipsByUserParams): Promise<EngagementTeamMember[]> => {
    if (!user_external_id) {
        return [];
    }
    const url = replaceUrl(Endpoints.EngagementTeamMembers.GET_LIST_BY_USER, 'user_id', String(user_external_id));
    const responseData = await http.GetRequest<EngagementTeamMember[]>(url, { include_engagement_details, include_revoked, });
    return responseData.data ?? [];
};

export const revokeMembership = async (engagement_id: number, user_id: number): Promise<EngagementTeamMember> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementTeamMembers.UPDATE_STATUS,
        params: {
            engagement_id: String(engagement_id),
            user_id: String(user_id),
        },
    });
    const body = {
        action: 'revoke',
    };
    const responseData = await http.PatchRequest<EngagementTeamMember>(url, body);
    return responseData.data;
};

export const reinstateMembership = async (engagement_id: number, user_id: number): Promise<EngagementTeamMember> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementTeamMembers.UPDATE_STATUS,
        params: {
            engagement_id: String(engagement_id),
            user_id: String(user_id),
        },
    });
    const body = {
        action: 'reinstate',
    };
    const responseData = await http.PatchRequest<EngagementTeamMember>(url, body);
    return responseData.data;
};
