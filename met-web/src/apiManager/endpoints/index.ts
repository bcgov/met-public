import { AppConfig } from '../../config';

const API = {
    GET_ENGAGEMENTS: `${AppConfig.apiUrl}/engagement/`,
    CREATE_ENGAGEMENT: `${AppConfig.apiUrl}/engagement/`,
    UPDATE_ENGAGEMENT: `${AppConfig.apiUrl}/engagement/`,
    GET_ENGAGEMENT: `${AppConfig.apiUrl}/engagement/<engagement_id>`,
};
export default API;
