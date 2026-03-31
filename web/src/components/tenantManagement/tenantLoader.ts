import { Params } from 'react-router';
import { getAllTenants, getTenant } from 'services/tenantService';

export const allTenantsLoader = () => {
    const tenants = getAllTenants();
    return tenants;
};

export const tenantLoader = ({ params }: { params: Params<string> }) => {
    const { tenantShortName } = params;
    if (!tenantShortName) throw new Error('Tenant ID is required');

    const tenant = getTenant(tenantShortName);
    return tenant;
};

export default tenantLoader;
