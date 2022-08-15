import { AppConfig } from 'config';

const Endpoints = {
    Engagement: {
        GET_ALL: `${AppConfig.apiUrl}/engagement/`,
        CREATE: `${AppConfig.apiUrl}/engagement/`,
        UPDATE: `${AppConfig.apiUrl}/engagement/`,
        GET: `${AppConfig.apiUrl}/engagement/engagement_id`,
    },
    User: {
        CREATE_UPDATE: `${AppConfig.apiUrl}/user/`,
    },
    Document: {
        OSS_HEADER: `${AppConfig.apiUrl}/document/`,
    },
    Survey: {
        GET_ALL: `${AppConfig.apiUrl}/survey/`,
        CREATE: `${AppConfig.apiUrl}/survey/`,
        UPDATE: `${AppConfig.apiUrl}/survey/`,
        LINK_TO_ENGAGEMENT: `${AppConfig.apiUrl}/survey/survey_id/link/engagement/engagement_id`,
        GET: `${AppConfig.apiUrl}/survey/survey_id`,
    },
    SurveySubmission: {
        CREATE: `${AppConfig.apiUrl}/submission/`,
    },
    Comment: {
        GET_ALL: `${AppConfig.apiUrl}/comment/survey/survey_id/comments`,
        REVIEW: `${AppConfig.apiUrl}/comment/comment_id `,
        GET: `${AppConfig.apiUrl}/comment/comment_id`,
    },
    EmailVerification: {
        GET: `${AppConfig.apiUrl}/email_verification/verification_token`,
        CREATE: `${AppConfig.apiUrl}/email_verification/`,
    },
};

export default Endpoints;
