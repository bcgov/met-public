import { getMyTenants } from 'services/tenantService';
import { fetchVersion } from 'services/versionService';

export const authenticatedRootLoader = async () => {
    // Data that should be available on all authenticated pages
    const myTenants = getMyTenants();
    const apiVersion = fetchVersion();
    return { myTenants, apiVersion };
};
