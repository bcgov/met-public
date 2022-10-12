import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { WidgetsList } from 'models/widget';

export const getWidgets = async (engagement_id: number): Promise<WidgetsList[]> => {
    const url = replaceUrl(Endpoints.Widgets.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<WidgetsList[]>(url);
    return responseData.data.result ?? [];
};
