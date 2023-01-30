import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
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
