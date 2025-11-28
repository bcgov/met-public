import { getMyTenants } from 'services/tenantService';
import { fetchVersion, VersionInfo } from 'services/versionService';
import { Tenant } from 'models/tenant';

export interface AuthenticatedRootLoaderData {
    myTenants: Promise<Tenant[]>;
    apiVersion: Promise<VersionInfo>;
}

export const authenticatedRootLoader = (): AuthenticatedRootLoaderData => {
    // Data that should be available on all authenticated pages
    const myTenants = getMyTenants();
    const apiVersion = fetchVersion();
    return { myTenants, apiVersion };
};
