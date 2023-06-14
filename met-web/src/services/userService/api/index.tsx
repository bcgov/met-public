import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { Page } from 'services/type';
import { User } from 'models/user';
import { replaceUrl } from 'helper';
import { Engagement } from 'models/engagement';

interface GetUserListParams {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
    // If yes, user groups will be fetched as well from keycloak
    include_groups?: boolean;
}
export const getUserList = async (params: GetUserListParams = {}): Promise<Page<User>> => {
    const responseData = await http.GetRequest<Page<User>>(Endpoints.User.GET_LIST, params);
    return (
        responseData.data ?? {
            items: [],
            total: 0,
        }
    );
};

interface GetUserParams {
    user_id: number;
    // If yes, user groups will be fetched as well from keycloak
    include_groups?: boolean;
}
export const getUser = async (params: GetUserParams): Promise<User> => {
    const url = replaceUrl(Endpoints.User.GET, 'user_id', String(params.user_id));
    const response = await http.GetRequest<User>(url, params);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch user details');
};

interface AddUserToGroupProps {
    user_id?: string;
    group?: string;
}
export const addUserToGroup = async ({ user_id, group }: AddUserToGroupProps): Promise<User> => {
    const url = replaceUrl(Endpoints.User.ADD_TO_GROUP, 'user_id', String(user_id));
    const responseData = await http.PostRequest<User>(url, {}, { group });
    return responseData.data;
};

interface GetUserEngagementsParams {
    user_id?: string;
}

export const fetchUserEngagements = async ({ user_id }: GetUserEngagementsParams): Promise<Engagement[]> => {
    if (!user_id) {
        return [];
    }
    const url = replaceUrl(Endpoints.User.GET_USER_ENGAGEMENTS, 'user_id', String(user_id));
    const responseData = await http.GetRequest<Engagement[]>(url);
    return responseData.data ?? [];
};
