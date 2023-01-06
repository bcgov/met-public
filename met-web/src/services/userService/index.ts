import { _kc } from 'constants/tenantConstants';
import { userToken, userDetails, userAuthorization, userAuthentication } from './userSlice';
import { Action, AnyAction, Dispatch } from 'redux';
import _jwt from 'jsonwebtoken';
import { UserDetail } from './types';
import { AppConfig } from 'config';
import Endpoints from 'apiManager/endpoints';
import http from 'apiManager/httpRequestHandler';
import { User } from 'models/user';
import { Page } from 'services/type';

const KeycloakData = _kc;

/**
 * Initializes Keycloak instance.
 */
const initKeycloak = async (dispatch: Dispatch<AnyAction>) => {
    try {
        const authenticated = await KeycloakData.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
            checkLoginIframe: false,
        });

        if (!authenticated) {
            console.warn('not authenticated!');
            dispatch(userAuthentication(authenticated));
            return;
        }

        dispatch(userToken(KeycloakData.token));
        const userDetail: UserDetail = await KeycloakData.loadUserInfo();
        const updateUserResponse = await updateUser();
        if (updateUserResponse.data) {
            userDetail.user = updateUserResponse.data;
            dispatch(userDetails(userDetail));
            dispatch(userAuthorization(true));
        } else {
            console.error('Missing user object');
            dispatch(userAuthentication(false));
        }

        dispatch(userAuthentication(KeycloakData.authenticated ? true : false));
        refreshToken(dispatch);
    } catch (err) {
        console.error(err);
        dispatch(userAuthentication(false));
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let refreshInterval: any;
const refreshToken = (dispatch: Dispatch<Action>) => {
    refreshInterval = setInterval(async () => {
        if (KeycloakData) {
            try {
                const refreshed = await KeycloakData.updateToken(3000);
                if (refreshed) {
                    dispatch(userToken(KeycloakData.token));
                }
            } catch (error) {
                console.log(error);
                userLogout();
            }
        }
    }, 60000);
};

/**
 * Logout function
 */
const userLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearInterval(refreshInterval);
    doLogout();
};

const doLogin = KeycloakData.login;

const doLogout = KeycloakData.logout;

const getToken = () => KeycloakData.token;

const isLoggedIn = () => !!KeycloakData.token;

const hasRole = (role: string) => KeycloakData.hasResourceRole(role);

const hasAdminRole = () => KeycloakData.hasResourceRole(AppConfig.keycloak.adminRole);

const updateUser = async () => {
    try {
        return await http.PutRequest<User>(Endpoints.User.CREATE_UPDATE);
    } catch (e: unknown) {
        console.error(e);
        return Promise.reject(e);
    }
};

interface GetUserParams {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
}
const getUserList = async (params: GetUserParams = {}): Promise<Page<User>> => {
    const responseData = await http.GetRequest<Page<User>>(Endpoints.User.GET_LIST, params);
    return (
        JSON.parse(JSON.stringify(responseData)).data ?? {
            items: [],
            total: 0,
        }
    );
};

const UserService = {
    initKeycloak,
    updateUser,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    hasRole,
    hasAdminRole,
    getUserList,
};

export default UserService;
