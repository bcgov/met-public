import { AppConfig } from 'config';
import Keycloak from 'keycloak-js';
import { ITenantDetail } from './types';

// Keycloak Environment Variables
export const tenantDetail: ITenantDetail = {
    realm: AppConfig.keycloak.realm,
    url: AppConfig.keycloak.url,
    clientId: AppConfig.keycloak.clientId,
};

// Create the Keycloak instance for the tenant
export const KeycloakClient: Keycloak = new Keycloak(tenantDetail);
