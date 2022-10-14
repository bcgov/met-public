import { AppConfig } from 'config';

const Endpoints = {
    Engagement: {
        GET_LIST: `${AppConfig.apiUrl}/engagements/`,
        CREATE: `${AppConfig.apiUrl}/engagements/`,
        UPDATE: `${AppConfig.apiUrl}/engagements/`,
        GET: `${AppConfig.apiUrl}/engagements/engagement_id`,
    },
    User: {
        CREATE_UPDATE: `${AppConfig.apiUrl}/user/`,
    },
    Document: {
        OSS_HEADER: `${AppConfig.apiUrl}/document/`,
    },
    Survey: {
        GET_LIST: `${AppConfig.apiUrl}/surveys/`,
        CREATE: `${AppConfig.apiUrl}/surveys/`,
        UPDATE: `${AppConfig.apiUrl}/surveys/`,
        LINK_TO_ENGAGEMENT: `${AppConfig.apiUrl}/surveys/survey_id/link/engagement/engagement_id`,
        UNLINK_FROM_ENGAGEMENT: `${AppConfig.apiUrl}/surveys/survey_id/unlink/engagement/engagement_id`,
        GET: `${AppConfig.apiUrl}/surveys/survey_id`,
    },
    SurveySubmission: {
        CREATE: `${AppConfig.apiUrl}/submission/`,
    },
    Comment: {
        GET_LIST: `${AppConfig.apiUrl}/comments/survey/survey_id`,
        REVIEW: `${AppConfig.apiUrl}/comments/comment_id `,
        GET: `${AppConfig.apiUrl}/comments/comment_id`,
    },
    Feedback: {
        GET_LIST: `${AppConfig.apiUrl}/feedbacks/`,
        CREATE: `${AppConfig.apiUrl}/feedbacks/`,
    },
    EmailVerification: {
        GET: `${AppConfig.apiUrl}/email_verification/verification_token`,
        CREATE: `${AppConfig.apiUrl}/email_verification/`,
    },
    Widgets: {
        GET_LIST: `${AppConfig.apiUrl}/widgets/engagement/engagement_id`,
        CREATE: `${AppConfig.apiUrl}/widgets/engagement/engagement_id`,
    },
    Contacts: {
        GET: `${AppConfig.apiUrl}/contacts/contact_id`,
        GET_LIST: `${AppConfig.apiUrl}/contacts/`,
        CREATE: `${AppConfig.apiUrl}/contacts/`,
    },
};

export default Endpoints;
