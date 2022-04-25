import { _kc } from "../constants/tenantConstants";
import { Keycloak_Client } from "../constants/constants";
import {
  userToken,
  userRoles,
  userDetails,
  userAuthorization,
  userAuthentication,
} from "./userSlice";

const KeycloakData = _kc;
/**
 * Initializes Keycloak instance.
 */
const initKeycloak = (dispatch) => {
  _kc
    .init({
      onLoad: "check-sso",
      promiseType: "native",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.warn("not authenticated!");
        dispatch(userAuthentication(authenticated));
        return;
      }

      if (!KeycloakData.resourceAccess[Keycloak_Client]) {
        doLogout();
        return;
      }

      if (authenticated) {
        const UserRoles = KeycloakData.resourceAccess[Keycloak_Client].roles;
        dispatch(userRoles(UserRoles));
        dispatch(userToken(KeycloakData.token));

        KeycloakData.loadUserInfo().then((res) => {
          dispatch(userDetails(res));
          dispatch(userAuthorization(true));
        });
        dispatch(userAuthentication(authenticated));
        refreshToken(dispatch);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

let refreshInterval;
const refreshToken = (dispatch) => {
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

const getUsername = () => KeycloakData.tokenParsed?.preferred_username;

const hasRole = (roles) =>
  roles.some((role) => KeycloakData.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getUsername,
  hasRole,
};

export default UserService;
