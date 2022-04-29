import { _kc } from "../constants/tenantConstants";
import { Keycloak_Client, ADMIN_ROLE } from "../constants/constants";
import {
  userToken,
  userRoles,
  userDetails,
  userAuthorization,
  userAuthentication,
} from "./userSlice";
import { Dispatch } from "redux";

const KeycloakData = _kc;
/**
 * Initializes Keycloak instance.
 */
const initKeycloak = (dispatch: Dispatch<any>) => {
  KeycloakData.init({
    onLoad: "check-sso",
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

      if (
        !KeycloakData.resourceAccess ||
        !KeycloakData.resourceAccess[Keycloak_Client]
      ) {
        doLogout();
        return;
      }

      if (authenticated) {
        const UserRoles = KeycloakData.resourceAccess[Keycloak_Client].roles;
        dispatch(userRoles(UserRoles));
        dispatch(userToken(KeycloakData.token));

        KeycloakData.loadUserInfo().then((res: UserDetail) => {
          dispatch(userDetails(res));
          dispatch(userAuthorization(true));
        });
        dispatch(userAuthentication(authenticated));
        refreshToken(dispatch);
      }
    })
    .catch((error) => {
      dispatch(userAuthentication(false));
      console.log(error);
    });
};

let refreshInterval: NodeJS.Timer;
const refreshToken = (dispatch: Dispatch<any>) => {
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

const hasRole = (role: string) => KeycloakData.hasResourceRole(role);

const hasAdminRole = () => KeycloakData.hasResourceRole(ADMIN_ROLE);

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  hasRole,
  hasAdminRole,
};

export default UserService;
