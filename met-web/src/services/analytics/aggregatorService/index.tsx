import http from 'apiManager/httpRequestHandler';
import { AggregatorData } from 'models/analytics/aggregator';
import Endpoints from 'apiManager/endpoints';

interface GetCountParams {
    engagement_id?: number;
    count_for?: string;
}

export const getAggregatorData = async (params: GetCountParams = {}): Promise<AggregatorData> => {
    const response = await http.GetRequest<AggregatorData>(Endpoints.AnalyticsAggregator.GET_COUNT, params);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch aggregate data');
};
