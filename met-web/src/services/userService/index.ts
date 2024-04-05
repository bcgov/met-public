import { _kc } from 'constants/tenantConstants';
import {
    userToken,
    userDetails,
    userAuthorization,
    userAuthentication,
    userRoles,
    assignedEngagements,
} from './userSlice';
import { Action, AnyAction, Dispatch } from 'redux';
import { UserDetail } from './types';
import { AppConfig } from 'config';
import Endpoints from 'apiManager/endpoints';
import http from 'apiManager/httpRequestHandler';
import { User } from 'models/user';
import { getMembershipsByUser } from 'services/membershipService';
import { USER_ROLES } from 'services/userService/constants';
import { getBaseUrl } from 'helper';

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

        // Check if tokens are defined before storing them in session storage
        if (KeycloakData.token) {
            sessionStorage.setItem('accessToken', KeycloakData.token);
        }
        if (KeycloakData.idToken) {
            sessionStorage.setItem('idToken', KeycloakData.idToken);
        }
        if (KeycloakData.refreshToken) {
            sessionStorage.setItem('refreshToken', KeycloakData.refreshToken);
        }

        const userDetail: UserDetail = await KeycloakData.loadUserInfo();
        const updateUserResponse = await updateUser();
        if (updateUserResponse.data) {
            userDetail.user = updateUserResponse.data;
            const engagementsIds = await getAssignedEngagements(userDetail.sub || '', userDetail.user?.roles || []);
            dispatch(userDetails(userDetail));
            dispatch(userRoles(userDetail.user?.roles || []));
            dispatch(assignedEngagements(engagementsIds));
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

let refreshInterval: NodeJS.Timer;
const refreshToken = (dispatch: Dispatch<Action>) => {
    refreshInterval = setInterval(async () => {
        if (KeycloakData) {
            try {
                const refreshed = await KeycloakData.updateToken(3000);
                if (refreshed) {
                    dispatch(userToken(KeycloakData.token));
                    // Check if tokens are defined before storing them in session storage
                    if (KeycloakData.token) {
                        sessionStorage.setItem('accessToken', KeycloakData.token);
                    }
                    if (KeycloakData.idToken) {
                        sessionStorage.setItem('idToken', KeycloakData.idToken);
                    }
                    if (KeycloakData.refreshToken) {
                        sessionStorage.setItem('refreshToken', KeycloakData.refreshToken);
                    }
                }
            } catch (error) {
                console.log(error);
                doLogout();
            }
        }
    }, 60000);
};

const doLogin = (redirectUri?: string) => KeycloakData.login({ redirectUri: (redirectUri ?? getBaseUrl()) + '/' });

const doLogout = async () => {
    // Remove tokens from session storage
    sessionStorage.removeItem('accessToken');
    const idToken = sessionStorage.getItem('idToken'); // Get the stored ID token
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('refreshToken');
    clearInterval(refreshInterval);
    const baseURL = getBaseUrl();
    const language = sessionStorage.getItem('languageId');

    // Check if the ID token is available and pass it as id_token_hint
    const logoutOptions = {
        redirectUri: `${baseURL}/${language}`,
        id_token_hint: idToken,
    };

    await KeycloakData.logout(logoutOptions);
};

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

const getAssignedEngagements = async (externalId: string, roles: string[]) => {
    if (roles.includes(USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS) || !externalId) {
        return [];
    }
    try {
        const memberships = await getMembershipsByUser({
            user_external_id: externalId,
        });
        return memberships.map((membership) => membership.engagement_id);
    } catch (e: unknown) {
        console.error(e);
        return Promise.reject(e);
    }
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
};

export default UserService;
