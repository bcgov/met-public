import http from 'apiManager/httpRequestHandler';
import { Comment } from 'models/comment';
import Endpoints from 'apiManager/endpoints';

import { replaceUrl } from 'helper';
import { Page } from 'services/type';
import { AxiosResponse } from 'axios';
import { downloadFile } from 'utils';

interface GetCommentsParams {
    survey_id: number;
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}
export const getCommentsPage = async ({
    survey_id,
    page,
    size,
    sort_key,
    sort_order,
    search_text,
}: GetCommentsParams): Promise<Page<Comment>> => {
    const url = replaceUrl(Endpoints.Comment.GET_LIST, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Page<Comment>>(url, { page, size, sort_key, sort_order, search_text });
    return (
        responseData.data ?? {
            items: [],
            total: 0,
        }
    );
};

interface GenerateCommentsSheetParams {
    survey_id: number;
}
export const getCommentsSheet = async ({ survey_id }: GenerateCommentsSheetParams) => {
    const url = replaceUrl(Endpoints.Comment.GET_SPREAD_SHEET, 'survey_id', String(survey_id));
    const headers = {
        'Content-type': 'text/csv; charset=utf-8',
    };
    return http.GetRequest<Blob>(url, {}, headers);
};
