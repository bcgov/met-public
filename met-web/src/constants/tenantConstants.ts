import { AppConfig } from 'config';
import Keycloak from 'keycloak-js';
import { ITenantDetail } from './types';

//TODO get from api
export const tenantDetail: ITenantDetail = {
    realm: AppConfig.keycloak.realm,
    url: AppConfig.keycloak.url,
    clientId: AppConfig.keycloak.clientId,
};

// eslint-disable-next-line
export const _kc: Keycloak.default = new (Keycloak as any)(tenantDetail);
