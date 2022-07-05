import http from 'apiManager/httpRequestHandler';
import { Survey } from 'models/survey';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const fetchAllSurveys = async (): Promise<Survey[]> => {
    const responseData = await http.GetRequest<Survey[]>(Endpoints.Survey.GET_ALL);
    return responseData.data.result ?? [];
};

// export const getEngagement = async (
//     engagementId: number,
//     successCallback: (data: Survey) => void,
//     errorCallback: (errorMessage: string) => void,
// ) => {
//     try {
//         const url = replaceUrl(Endpoints.Survey.GET, '<survey_id>', String(engagementId));
//         if (!engagementId || isNaN(Number(engagementId))) {
//             throw new Error('Invalid Survey Id ' + engagementId);
//         }
//         const responseData = await http.GetRequest<Survey>(url);
//         if (responseData.data.result) {
//             successCallback(responseData.data.result);
//         } else {
//             errorCallback('Missing survey object');
//         }
//     } catch (e: unknown) {
//         let errorMessage = '';
//         if (typeof e === 'string') {
//             errorMessage = e.toUpperCase();
//         } else if (e instanceof Error) {
//             errorMessage = e.message;
//         }
//         errorCallback(errorMessage);
//     }
// };

// export const postEngagement = async (
//     data: PostEngagementRequest,
//     successCallback: () => void,
//     errorCallback: (errorMessage: string) => void,
// ) => {
//     try {
//         await http.PostRequest(Endpoints.Survey.CREATE, data);
//         successCallback();
//     } catch (e: unknown) {
//         let errorMessage = '';
//         if (typeof e === 'string') {
//             errorMessage = e.toUpperCase();
//         } else if (e instanceof Error) {
//             errorMessage = e.message;
//         }
//         errorCallback(errorMessage);
//     }
// };
