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
import { SCOPES } from 'components/permissionsGate/PermissionMaps';

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

const doLogout = async (navigateCallback?: () => void) => {
    if (navigateCallback) {
        navigateCallback();
    }
    await KeycloakData.logout();
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
    if (roles.includes(SCOPES.viewPrivateEngagements) || !externalId) {
        return [];
    }
    try {
        const memberships = await getMembershipsByUser({
            user_id: externalId,
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
