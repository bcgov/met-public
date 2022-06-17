import { _kc } from '../../constants/tenantConstants';
import { userToken, userDetails, userAuthorization, userAuthentication } from './userSlice';
import { Action, AnyAction, Dispatch } from 'redux';
import jwt from 'jsonwebtoken';
import { UserDetail } from './types';
import { AppConfig } from '../../config';
import axios from 'axios';

const KeycloakData = _kc;

/**
 * Initializes Keycloak instance.
 */
const initKeycloak = (dispatch: Dispatch<AnyAction>) => {
    KeycloakData.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,
    })
        .then(async (authenticated) => {
            if (!authenticated) {
                console.warn('not authenticated!');
                dispatch(userAuthentication(authenticated));
                return;
            }

            dispatch(userToken(KeycloakData.token));
            KeycloakData.loadUserInfo().then((res: UserDetail) => {
                updateUser();
                dispatch(userDetails(res));
                dispatch(userAuthorization(true));
            });

            dispatch(userAuthentication(KeycloakData.authenticated ? true : false));
            refreshToken(dispatch);
            /* 
        To do: uncomment when we have FORMIO_JWT_SECRET and USER_RESOURCE_FORM_ID 
        authenticateAnonymouslyOnFormio();
      */
        })
        .catch((error) => {
            console.log(error);
            dispatch(userAuthentication(false));
        });
};

let refreshInterval: NodeJS.Timer;
const refreshToken = (dispatch: Dispatch<Action>) => {
    refreshInterval = setInterval(() => {
        KeycloakData &&
            KeycloakData.updateToken(3000)
                .then((refreshed) => {
                    if (refreshed) {
                        dispatch(userToken(KeycloakData.token));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    userLogout();
                });
    }, 60000);
};

// eslint-disable-next-line
const authenticateAnonymouslyOnFormio = () => {
    const user = AppConfig.formio.anonymousUser;
    const roles = [AppConfig.formio.anonymousId];
    authenticateFormio(user, roles);
};

const authenticateFormio = async (user: string, roles: string[]) => {
    const FORMIO_TOKEN = jwt.sign(
        {
            external: true,
            form: {
                _id: AppConfig.formio.userResourceFormId, // form.io form Id of user resource
            },
            user: {
                _id: user, // keep it like that
                roles: roles,
            },
        },
        AppConfig.formio.jwtSecret,
    ); // TODO Move JWT secret key to COME From ENV

    localStorage.setItem('formioToken', FORMIO_TOKEN);
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
        await axios.put(
            `${AppConfig.apiUrl}/user/`,
            {},
            {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        );
    } catch (e: unknown) {
        console.error(e);
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
