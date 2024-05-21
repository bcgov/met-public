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
    return Promise.reject(Error('Failed to fetch tenant info'));
};

export const getAllTenants = async (): Promise<Tenant[]> => {
    const response = await http.GetRequest<Tenant[]>(Endpoints.Tenants.GET_LIST);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(Error('Failed to fetch tenants'));
};

export const createTenant = async (tenant: Tenant): Promise<Tenant> => {
    const response = await http.PostRequest<Tenant>(Endpoints.Tenants.CREATE, tenant);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(Error('Failed to create tenant'));
};

export const updateTenant = async (tenant: Tenant, shortName: string): Promise<Tenant> => {
    const url = replaceUrl(Endpoints.Tenants.UPDATE, 'tenant_id', shortName);
    const response = await http.PatchRequest<Tenant>(url, tenant);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(Error('Failed to update tenant'));
};
