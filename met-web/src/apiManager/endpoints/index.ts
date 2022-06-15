import { AppConfig } from '../../config';

const API = {
    MET_GET_ENGAGEMENTS: `${AppConfig.apiUrl}/engagement`,
    MET_GET_ENGAGEMENT: `${AppConfig.apiUrl}/engagement/<engagement_id>`,
    MET_CREATE_ENGAGEMENT: `${AppConfig.apiUrl}/engagement`,
    MET_UPDATE_ENGAGEMENT: `${AppConfig.apiUrl}/engagement`,
};
export default API;
