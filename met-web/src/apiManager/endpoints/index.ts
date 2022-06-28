import { AppConfig } from 'config';

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
    s3: {
        OSS_HEADER: `${AppConfig.apiUrl}/document/`,
    },
};

export default Endpoints;
