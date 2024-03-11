import http from 'apiManager/httpRequestHandler';
import { EngagementMetadata, MetadataTaxonModify, MetadataTaxon } from 'models/engagement';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getEngagementMetadata = async (engagementId: number): Promise<EngagementMetadata[]> => {
    const url = replaceUrl(Endpoints.EngagementMetadata.GET_BY_ENG, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject(new Error('Invalid Engagement Id ' + engagementId));
    }
    const response = await http.GetRequest<EngagementMetadata[]>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to fetch engagement'));
};

export const postEngagementMetadata = async (data: EngagementMetadata): Promise<EngagementMetadata> => {
    const response = await http.PostRequest<EngagementMetadata>(Endpoints.EngagementMetadata.CREATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to create engagement metadata'));
};

export const patchEngagementMetadata = async (data: EngagementMetadata): Promise<EngagementMetadata> => {
    const response = await http.PatchRequest<EngagementMetadata>(Endpoints.EngagementMetadata.UPDATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to update engagement metadata'));
};

export const bulkPatchEngagementMetadata = async (
    taxon_id: number,
    engagement_id: number,
    values: Array<string>,
): Promise<Array<EngagementMetadata>> => {
    const url = replaceUrl(Endpoints.EngagementMetadata.BULK_UPDATE, 'engagement_id', String(engagement_id));
    const response = await http.PatchRequest<Array<EngagementMetadata>>(url, { taxon_id, values });
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to update engagement metadata'));
};

export const getMetadataTaxa = async (): Promise<Array<MetadataTaxon>> => {
    const response = await http.GetRequest<Array<MetadataTaxon>>(Endpoints.MetadataTaxa.GET_BY_TENANT);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to fetch metadata taxa'));
};

export const getMetadataTaxon = async (taxonId: number): Promise<MetadataTaxon> => {
    const url = replaceUrl(Endpoints.MetadataTaxa.GET, 'taxon_id', String(taxonId));
    if (!taxonId || isNaN(Number(taxonId))) {
        return Promise.reject(new Error('Invalid Taxon Id ' + taxonId));
    }
    const response = await http.GetRequest<MetadataTaxon>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to fetch metadata taxon'));
};

export const postMetadataTaxon = async (data: MetadataTaxonModify): Promise<MetadataTaxon> => {
    const response = await http.PostRequest<MetadataTaxon>(Endpoints.MetadataTaxa.CREATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to create metadata taxon'));
};

export const patchMetadataTaxon = async (id: number, data: MetadataTaxonModify): Promise<MetadataTaxon> => {
    const url = replaceUrl(Endpoints.MetadataTaxa.UPDATE, 'taxon_id', String(id));
    const response = await http.PatchRequest<MetadataTaxon>(url, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to update metadata taxon'));
};

export const deleteMetadataTaxon = async (taxonId: number): Promise<void> => {
    const url = replaceUrl(Endpoints.MetadataTaxa.DELETE, 'taxon_id', String(taxonId));
    const response = await http.DeleteRequest<MetadataTaxon>(url);
    if (response.status === 204) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Failed to delete metadata taxon'));
};

export const patchMetadataTaxaOrder = async (taxonIds: Array<number>): Promise<Array<MetadataTaxon>> => {
    const data = {
        taxon_ids: taxonIds,
    };
    const response = await http.PatchRequest<Array<MetadataTaxon>>(Endpoints.MetadataTaxa.REORDER, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject(new Error('Failed to reorder metadata taxa'));
};
