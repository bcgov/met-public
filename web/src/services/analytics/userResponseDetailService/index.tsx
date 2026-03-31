import http from 'apiManager/httpRequestHandler';
import { UserResponseDetailByMonth, UserResponseDetailByWeek } from 'models/analytics/userResponseDetail';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getUserResponseDetailByMonth = async (
    engagementId: number,
    fromDate?: string,
    toDate?: string,
): Promise<UserResponseDetailByMonth> => {
    const url = replaceUrl(
        `${Endpoints.AnalyticsUserResponseDetail.GET_COUNT_BY_MONTH}?from_date=${fromDate}&to_date=${toDate}`,
        'engagement_id',
        String(engagementId),
    );
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<UserResponseDetailByMonth>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch user response detail');
};

export const getUserResponseDetailByWeek = async (
    engagementId: number,
    fromDate?: string,
    toDate?: string,
): Promise<UserResponseDetailByWeek> => {
    const url = replaceUrl(
        `${Endpoints.AnalyticsUserResponseDetail.GET_COUNT_BY_WEEK}?from_date=${fromDate}&to_date=${toDate}`,
        'engagement_id',
        String(engagementId),
    );
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<UserResponseDetailByWeek>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch user response detail');
};
