import http from 'apiManager/httpRequestHandler';
import { DocumentItem, DocumentType } from 'models/document';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

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
