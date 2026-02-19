import { EmailVerification } from 'models/emailVerification';
import { Engagement } from 'models/engagement';
import { Survey } from 'models/survey';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import { SurveySubmission } from 'models/surveySubmission';
import { Params } from 'react-router';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getSubmissionByToken } from 'services/submissionService';
import { getSurvey } from 'services/surveyService';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export type SurveyLoaderData = {
    engagement: Engagement | null;
    language: string | undefined;
    reportSettings: SurveyReportSetting[] | null;
    slug: { slug: string } | null;
    submission: SurveySubmission | null;
    survey: Survey;
    surveyId: string | undefined;
    token: string | undefined;
    verification: EmailVerification | null;
};

export const SurveyLoader = async ({ params }: { params: Params<string> }) => {
    const { surveyId, token, language, engagementId, slug: urlSlug } = params;
    if (isNaN(Number(surveyId)) && !isNaN(Number(engagementId)) && !urlSlug) throw new Error('Invalid survey ID');

    const verPromise = token ? getEmailVerification(token) : null;
    let engPromise = engagementId ? getEngagement(Number(engagementId)) : null;
    let survey: Survey | null = null;
    // Try getting the engagement by the survey ID if the engagement ID isn't present
    if (!engPromise && !engagementId && surveyId) {
        survey = await getSurvey(Number(surveyId));
        engPromise = getEngagement(Number(survey?.engagement_id)) || null;
    }
    const [engagement, verification] = await Promise.all([engPromise, verPromise]);
    survey = !survey && surveyId ? await getSurvey(Number(surveyId)) : survey || engagement?.surveys?.[0] || null;

    const slugPromise = engagement?.id && !urlSlug ? getSlugByEngagementId(engagement?.id) : urlSlug || null;
    const submissionPromise = verification?.verification_token
        ? getSubmissionByToken(verification.verification_token)
        : null;
    const reportSettingsPromise = survey?.id ? fetchSurveyReportSettings(String(survey.id)) : null;
    const results = await Promise.all([slugPromise, submissionPromise]);
    const [slug, submission] = results;
    try {
        const reportSettings = await reportSettingsPromise;
        return { engagement, language, reportSettings, slug, submission, survey, surveyId, token, verification };
    } catch (e) {
        // Don't throw
        console.log(e);
        return { engagement, language, slug, submission, survey, surveyId, token, verification };
    }
};

export default SurveyLoader;
