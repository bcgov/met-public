import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';

import { replaceUrl } from 'helper';
import { Page } from 'services/type';
import { SurveySubmission } from 'models/surveySubmission';

interface GetSubmissionsParams {
    survey_id: number;
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}
export const getSubmissionsPage = async ({
    survey_id,
    page,
    size,
    sort_key,
    sort_order,
    search_text,
}: GetSubmissionsParams): Promise<Page<SurveySubmission>> => {
    const url = replaceUrl(Endpoints.Submission.GET_LIST, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Page<SurveySubmission>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
    });
    return (
        responseData.data.result ?? {
            items: [],
            total: 0,
        }
    );
};
