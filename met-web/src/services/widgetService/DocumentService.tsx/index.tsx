import http from 'apiManager/httpRequestHandler';
import { DocumentItem } from 'models/document';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Page } from 'services/type';

export const fetchDocuments = async (widget_id: number): Promise<DocumentItem[]> => {
    try {
        const url = replaceUrl(Endpoints.Documents.GET_LIST, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<Page<DocumentItem>>(url);
        return responseData.data.result?.items ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostDocumentRequest {
    name?: string;
    widget_id?: number;
    parent_document_id?: number;
    document_url?: string;
}
export const postDocument = async (data: PostDocumentRequest): Promise<DocumentItem> => {
    try {
        const response = await http.PostRequest<DocumentItem>(Endpoints.Documents.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create document');
    } catch (err) {
        return Promise.reject(err);
    }
};
