import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { SurveyReportSetting } from 'models/surveyReportSetting';

export const fetchSurveyReportSettings = async (surveyId: string): Promise<SurveyReportSetting[]> => {
    const url = replaceUrl(Endpoints.SurveyReportSetting.GET_LIST, 'survey_id', surveyId);
    const responseData = await http.GetRequest<SurveyReportSetting[]>(url);
    return responseData.data ?? [];
};

interface PatchSurveyReportSetting {
    id: string;
    form_json: unknown;
}
export const updateSurveyReportSettings = async (surveyId: string, settingData: PatchSurveyReportSetting) => {
    const url = replaceUrl(Endpoints.SurveyReportSetting.UPDATE, 'survey_id', surveyId);
    const responseData = await http.PatchRequest<SurveyReportSetting[]>(url, settingData);
    return responseData.data ?? [];
};
