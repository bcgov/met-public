import { defer } from 'react-router-dom';
import { getMyTenants } from 'services/tenantService';

export const authenticatedRootLoader = async () => {
    // Data that should be available on all authenticated pages
    const myTenants = getMyTenants();
    return defer({ myTenants });
};
