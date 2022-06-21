import { AppConfig } from '../../config';

const Endpoints = {
    Engagement: {
        GET_ALL: `${AppConfig.apiUrl}/engagement/`,
        CREATE: `${AppConfig.apiUrl}/engagement/`,
        UPDATE: `${AppConfig.apiUrl}/engagement/`,
        GET: `${AppConfig.apiUrl}/engagement/<engagement_id>`,
    },
    User: {
        CREATE_UPDATE: `${AppConfig.apiUrl}/user/`,
    },
};

export default Endpoints;
