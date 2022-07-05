import http from 'apiManager/httpRequestHandler';
import { Survey } from 'models/survey';
import Endpoints from 'apiManager/endpoints';

export const fetchAllSurveys = async (): Promise<Survey[]> => {
    const responseData = await http.GetRequest<Survey[]>(Endpoints.Survey.GET_ALL);
    return responseData.data.result ?? [];
};
