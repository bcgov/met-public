import { Params, defer } from 'react-router-dom';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug, getSlugByEngagementId } from 'services/engagementSlugService';
import { getSubmissionByToken } from 'services/submissionService';
import { getSurvey } from 'services/surveyService';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export const SurveyLoader = async ({ params }: { params: Params<string> }) => {
    const { surveyId, token, language, engagementId, slug: urlSlug } = params;
    if (isNaN(Number(surveyId)) && !engagementId && !urlSlug) throw new Error('Invalid survey ID');
    const verification = getEmailVerification(token ?? '').catch(() => null);
    const survey = surveyId
        ? getSurvey(Number(surveyId))
        : engagementId
        ? getEngagement(Number(engagementId)).then((response) => Promise.resolve(response.surveys[0]))
        : getEngagementIdBySlug(urlSlug ?? '').then((response) =>
              getEngagement(response.engagement_id).then((response) => Promise.resolve(response.surveys[0])),
          );

    const submission = verification.then(
        (response) => response && getSubmissionByToken(response?.verification_token ?? ''),
    );
    const reportSettings = survey.then((response) => fetchSurveyReportSettings(response.id.toString()));
    const engagement = survey.then((response) => {
        if (!response.engagement_id) return null;
        return getEngagement(response.engagement_id);
    });
    const slug = engagement.then((response) => response && getSlugByEngagementId(response.id));
    return defer({ engagement, language, reportSettings, slug, submission, survey, surveyId, token, verification });
};
