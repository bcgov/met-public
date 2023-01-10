import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { Page } from 'services/type';
import { User } from 'models/user';
import { replaceUrl } from 'helper';

interface GetUserParams {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
}
export const getUserList = async (params: GetUserParams = {}): Promise<Page<User>> => {
    const responseData = await http.GetRequest<Page<User>>(Endpoints.User.GET_LIST, params);
    return (
        JSON.parse(JSON.stringify(responseData)).data ?? {
            items: [],
            total: 0,
        }
    );
};

interface AddUserToGroupProps {
    user_id?: string;
    group?: string;
}
export const addUserToGroup = async ({ user_id, group }: AddUserToGroupProps): Promise<User> => {
    const url = replaceUrl(Endpoints.User.ADD_TO_GROUP, 'user_id', String(user_id));
    const responseData = await http.PutRequest<User>(url, {}, { group });
    return responseData.data;
};
