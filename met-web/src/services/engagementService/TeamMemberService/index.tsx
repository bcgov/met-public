import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { EngagementTeamMember } from 'models/engagementTeamMember';

interface GetTeamMembersParams {
    engagement_id: number;
}
export const getTeamMembers = async ({ engagement_id }: GetTeamMembersParams): Promise<EngagementTeamMember> => {
    const url = replaceUrl(Endpoints.EngagementTeamMembers.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<EngagementTeamMember>(url);
    return responseData.data ?? [];
};

// interface AddUserToGroupProps {
//     user_id?: string;
//     group?: string;
//     engagement_id?: number;
// }
// export const addUserToGroup = async ({ user_id, group, engagement_id }: AddUserToGroupProps): Promise<User> => {
//     const url = replaceUrl(Endpoints.User.ADD_TO_GROUP, 'user_id', String(user_id));
//     const responseData = await http.PostRequest<User>(url, {}, { group, engagement_id });
//     return responseData.data;
// };
