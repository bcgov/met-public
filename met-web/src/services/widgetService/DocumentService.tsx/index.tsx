import http from 'apiManager/httpRequestHandler';
import { DocumentItem, DocumentType } from 'models/document';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';

/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const fetchDocuments = async (widget_id: number): Promise<DocumentItem[]> => {
    try {
        const url = replaceUrl(Endpoints.Documents.GET_LIST, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<DocumentItem>(url);
        return responseData.data.result?.children ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostDocumentRequest {
    title?: string;
    widget_id?: number;
    parent_document_id?: number | null;
    url?: string;
    type: DocumentType;
}
export const postDocument = async (widget_id: number, data: PostDocumentRequest): Promise<DocumentItem> => {
    try {
        const url = replaceUrl(Endpoints.Documents.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<DocumentItem>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create document');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteDocument = async (widget_id: number, document_id: number): Promise<DocumentItem> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Documents.DELETE,
            params: {
                document_id: String(document_id),
                widget_id: String(widget_id),
            },
        });
        const response = await http.DeleteRequest<DocumentItem>(url);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to delete document');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchDocumentRequest {
    title?: string;
    url?: string;
    parent_document_id?: number | null;
}

export const patchDocument = async (
    widget_id: number,
    document_id: number,
    data: PatchDocumentRequest,
): Promise<DocumentItem> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Documents.UPDATE,
            params: {
                document_id: String(document_id),
                widget_id: String(widget_id),
            },
        });
        const response = await http.PatchRequest<DocumentItem>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update document');
    } catch (err) {
        return Promise.reject(err);
    }
};
