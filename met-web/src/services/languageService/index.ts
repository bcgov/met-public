import { Language } from 'models/language';
import { LanguageTenantMapping } from 'models/languageTenantMapping';
import { replaceUrl, replaceAllInURL } from 'helper';
import Endpoints from 'apiManager/endpoints';
import http from 'apiManager/httpRequestHandler';

export const getLanguages = async (): Promise<Language[]> => {
    const response = await http.GetRequest<Language[]>(Endpoints.Languages.GET);
    if (response.data) {
        return response.data;
    }
    throw new Error('Failed to fetch languages.');
};

export const getTenantLanguages = async (tenantId: string): Promise<Language[]> => {
    const url = replaceUrl(Endpoints.Languages.GET_TENANT_LANGUAGES, 'tenant_id', String(tenantId));
    if (!tenantId) {
        throw new Error(`Invalid Tenant ID ${tenantId}`);
    }
    const response = await http.GetRequest<Language[]>(url);
    if (response.data) {
        return response.data;
    }
    throw new Error('Failed to fetch tenant languages.');
};

export const postTenantLanguage = async (tenantId: string, languageId: number): Promise<LanguageTenantMapping[]> => {
    const url = replaceAllInURL({
        URL: Endpoints.Languages.CREATE_OR_DELETE_TENANT_MAPPING,
        params: {
            tenant_id: String(tenantId),
            language_id: String(languageId),
        },
    });
    const response = await http.PostRequest<LanguageTenantMapping[]>(url);
    if (response.data) {
        return response.data;
    }
    throw new Error('Failed to save tenant language.');
};

export const deleteTenantLanguage = async (
    tenantId: string,
    languageId: number,
): Promise<{ message: string; status: string }> => {
    const url = replaceAllInURL({
        URL: Endpoints.Languages.CREATE_OR_DELETE_TENANT_MAPPING,
        params: {
            tenant_id: String(tenantId),
            language_id: String(languageId),
        },
    });
    const response = await http.DeleteRequest<{ message: string; status: string }>(url);
    if (response.data) {
        return response.data;
    }
    throw new Error('Failed to save tenant language.');
};
