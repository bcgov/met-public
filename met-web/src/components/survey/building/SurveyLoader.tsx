import { EmailVerification } from 'models/emailVerification';
import { Engagement } from 'models/engagement';
import { Survey } from 'models/survey';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import { SurveySubmission } from 'models/surveySubmission';
import { Params } from 'react-router';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug, getSlugByEngagementId } from 'services/engagementSlugService';
import { getSubmissionByToken } from 'services/submissionService';
import { getSurvey } from 'services/surveyService';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export type SurveyLoaderData = {
    engagement: Promise<Engagement | null>;
    language: string | undefined;
    reportSettings: Promise<SurveyReportSetting[] | null>;
    slug: Promise<{ slug: string } | null>;
    submission: Promise<SurveySubmission | null>;
    survey: Promise<Survey>;
    surveyId: string | undefined;
    token: string | undefined;
    verification: Promise<EmailVerification | null>;
};

export const SurveyLoader = async ({ params }: { params: Params<string> }) => {
    const { surveyId, token, language, engagementId, slug: urlSlug } = params;
    if (isNaN(Number(surveyId)) && !isNaN(Number(engagementId)) && !urlSlug) throw new Error('Invalid survey ID');
    const verification = getEmailVerification(token ?? '').catch(() => null);
    const getSurveyPromise = () => {
        if (!isNaN(Number(surveyId))) return getSurvey(Number(surveyId));
        if (urlSlug)
            return getEngagementIdBySlug(urlSlug ?? '').then((response) =>
                getEngagement(response.engagement_id).then((response) => Promise.resolve(response.surveys[0])),
            );
        return getEngagement(Number(engagementId)).then((response) => Promise.resolve(response.surveys[0]));
    };
    const survey = getSurveyPromise();

    const submission = verification.then(
        (response) => response && getSubmissionByToken(response?.verification_token ?? ''),
    );
    const reportSettings = survey.then((response) => fetchSurveyReportSettings(response.id.toString()));
    const engagement = survey.then((response) => {
        if (!response.engagement_id) return null;
        return getEngagement(response.engagement_id);
    });
    const slug = engagement.then((response) => response && getSlugByEngagementId(response.id));
    return { engagement, language, reportSettings, slug, submission, survey, surveyId, token, verification };
};

export default SurveyLoader;
