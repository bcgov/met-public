import {
  Keycloak_Client,
  KEYCLOAK_AUTH_URL,
  KEYCLOAK_REALM,
} from "./constants";
import Keycloak from "keycloak-js";

//TODO get from api
export const tenantDetail: ITenantDetail = {
  realm: KEYCLOAK_REALM,
  url: KEYCLOAK_AUTH_URL,
  clientId: Keycloak_Client,
};

export const _kc: Keycloak.KeycloakInstance = new (Keycloak as any)(
  tenantDetail
);
