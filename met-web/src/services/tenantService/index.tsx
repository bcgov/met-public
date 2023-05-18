import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { Tenant } from 'models/tenant';
import { replaceUrl } from 'helper';

export const getTenant = async (id: string): Promise<Tenant> => {
    const url = replaceUrl(Endpoints.Tenants.GET, 'tenant_id', id);
    const response = await http.GetRequest<Tenant>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch tenant info');
};
