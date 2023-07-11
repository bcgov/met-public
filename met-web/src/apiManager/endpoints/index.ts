import { AppConfig } from 'config';

const Endpoints = {
    Engagement: {
        GET_LIST: `${AppConfig.apiUrl}/engagements/`,
        CREATE: `${AppConfig.apiUrl}/engagements/`,
        UPDATE: `${AppConfig.apiUrl}/engagements/`,
        GET: `${AppConfig.apiUrl}/engagements/engagement_id`,
    },
    EngagementMetadata: {
        CREATE: `${AppConfig.apiUrl}/engagementsmetadata/`,
        UPDATE: `${AppConfig.apiUrl}/engagementsmetadata/`,
        GET: `${AppConfig.apiUrl}/engagementsmetadata/engagement_id`,
    },
    EngagementSlug: {
        UPDATE: `${AppConfig.apiUrl}/slugs/slug_id`,
        GET: `${AppConfig.apiUrl}/slugs/slug_id`,
        GET_ENG_ID: `${AppConfig.apiUrl}/slugs/engagements/engagement_id`,
    },
    User: {
        GET: `${AppConfig.apiUrl}/user/user_id`,
        CREATE_UPDATE: `${AppConfig.apiUrl}/user/`,
        GET_LIST: `${AppConfig.apiUrl}/user/`,
        ADD_TO_GROUP: `${AppConfig.apiUrl}/user/user_id/groups`,
        GET_USER_ENGAGEMENTS: `${AppConfig.apiUrl}/user/user_id/engagements`,
    },
    Document: {
        OSS_HEADER: `${AppConfig.apiUrl}/document/`,
    },
    Survey: {
        GET_LIST: `${AppConfig.apiUrl}/surveys/`,
        CREATE: `${AppConfig.apiUrl}/surveys/`,
        CLONE: `${AppConfig.apiUrl}/surveys/survey_id/clone`,
        UPDATE: `${AppConfig.apiUrl}/surveys/`,
        LINK_TO_ENGAGEMENT: `${AppConfig.apiUrl}/surveys/survey_id/link/engagement/engagement_id`,
        UNLINK_FROM_ENGAGEMENT: `${AppConfig.apiUrl}/surveys/survey_id/unlink/engagement/engagement_id`,
        GET: `${AppConfig.apiUrl}/surveys/survey_id`,
    },
    SurveySubmission: {
        REVIEW: `${AppConfig.apiUrl}/submissions/submission_id`,
        GET_LIST: `${AppConfig.apiUrl}/submissions/survey/survey_id`,
        GET: `${AppConfig.apiUrl}/submissions/submission_id`,
    },
    SurveyReportSetting: {
        GET_LIST: `${AppConfig.apiUrl}/surveys/survey_id/reportsettings`,
        UPDATE: `${AppConfig.apiUrl}/surveys/survey_id/reportsettings`,
        CREATE: `${AppConfig.apiUrl}/surveys/survey_id/reportsettings`,
    },
    Subscription: {
        GET: `${AppConfig.apiUrl}/subscription/participant_id`,
        CREATE: `${AppConfig.apiUrl}/subscription/`,
        UPDATE: `${AppConfig.apiUrl}/subscription/`,
        CREATE_UPDATE: `${AppConfig.apiUrl}/subscription/manage`,
    },
    PublicSubmission: {
        CREATE: `${AppConfig.apiUrl}/submissions/public/verification_token`,
        GET_BY_TOKEN: `${AppConfig.apiUrl}/submissions/public/verification_token`,
        UPDATE: `${AppConfig.apiUrl}/submissions/public/verification_token`,
    },
    Comment: {
        GET_LIST: `${AppConfig.apiUrl}/comments/survey/survey_id`,
        GET_SPREAD_SHEET: `${AppConfig.apiUrl}/comments/survey/survey_id/sheet`,
    },
    Feedback: {
        GET_LIST: `${AppConfig.apiUrl}/feedbacks/`,
        CREATE: `${AppConfig.apiUrl}/feedbacks/`,
    },
    EmailVerification: {
        GET: `${AppConfig.apiUrl}/email_verification/verification_token`,
        UPDATE: `${AppConfig.apiUrl}/email_verification/verification_token`,
        CREATE: `${AppConfig.apiUrl}/email_verification/`,
    },
    Widgets: {
        GET_LIST: `${AppConfig.apiUrl}/widgets/engagement/engagement_id`,
        CREATE: `${AppConfig.apiUrl}/widgets/engagement/engagement_id`,
        DELETE: `${AppConfig.apiUrl}/widgets/engagement/engagement_id/widget/widget_id`,
        SORT: `${AppConfig.apiUrl}/widgets/engagement/engagement_id/sort_index`,
    },
    Widget_items: {
        GET_LIST: `${AppConfig.apiUrl}/widgets/widget_id/items`,
        CREATE: `${AppConfig.apiUrl}/widgets/widget_id/items`,
    },
    Contacts: {
        GET: `${AppConfig.apiUrl}/contacts/contact_id`,
        GET_LIST: `${AppConfig.apiUrl}/contacts/`,
        CREATE: `${AppConfig.apiUrl}/contacts/`,
        UPDATE: `${AppConfig.apiUrl}/contacts/`,
    },
    Documents: {
        GET_LIST: `${AppConfig.apiUrl}/widgets/widget_id/documents`,
        CREATE: `${AppConfig.apiUrl}/widgets/widget_id/documents`,
        ORDER: `${AppConfig.apiUrl}/widgets/widget_id/documents/order`,
        DELETE: `${AppConfig.apiUrl}/widgets/widget_id/documents/document_id`,
        UPDATE: `${AppConfig.apiUrl}/widgets/widget_id/documents/document_id`,
    },
    EngagementTeamMembers: {
        GET_LIST: `${AppConfig.apiUrl}/engagements/engagement_id/members`,
        GET_LIST_BY_USER: `${AppConfig.apiUrl}/engagements/all/members/user_id`,
        CREATE: `${AppConfig.apiUrl}/engagements/engagement_id/members`,
    },
    Events: {
        CREATE: `${AppConfig.apiUrl}/widgets/widget_id/events`,
        GET_LIST: `${AppConfig.apiUrl}/widgets/widget_id/events`,
        UPDATE: `${AppConfig.apiUrl}/widgets/widget_id/events/event_id/item/item_id`,
        DELETE: `${AppConfig.apiUrl}/widgets/widget_id/events/event_id`,
        SORT: `${AppConfig.apiUrl}/widgets/widget_id/events/sort_index`,
    },
    Maps: {
        GET_LIST: `${AppConfig.apiUrl}/widgets/widget_id/maps`,
        CREATE: `${AppConfig.apiUrl}/widgets/widget_id/maps`,
        SHAPEFILE_PREVIEW: `${AppConfig.apiUrl}/shapefile`,
    },
    Tenants: {
        GET: `${AppConfig.apiUrl}/tenants/tenant_id`,
    },
    AnalyticsUserResponseDetail: {
        GET_COUNT_BY_MONTH: `${AppConfig.analyticsApiUrl}/responses/month/engagement_id`,
        GET_COUNT_BY_WEEK: `${AppConfig.analyticsApiUrl}/responses/week/engagement_id`,
    },
    AnalyticsAggregator: {
        GET_COUNT: `${AppConfig.analyticsApiUrl}/counts/`,
    },
    AnalyticsMap: {
        GET: `${AppConfig.analyticsApiUrl}/engagements/map/engagement_id`,
    },
    AnalyticsSurveyResult: {
        GET: `${AppConfig.analyticsApiUrl}/surveyresult/engagement_id`,
    },
};

export default Endpoints;
