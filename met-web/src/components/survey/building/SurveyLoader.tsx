import { Params, defer } from 'react-router-dom';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getSubmissionByToken } from 'services/submissionService';
import { getSurvey } from 'services/surveyService';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export const SurveyLoader = async ({ params }: { params: Params<string> }) => {
    const { surveyId, token, language } = params;
    if (isNaN(Number(surveyId)) && !token) throw new Error('Invalid survey ID');
    const verification = getEmailVerification(token ?? '').catch(() => null);
    const survey = surveyId
        ? getSurvey(Number(surveyId))
        : verification.then((response) => {
              if (!response) throw new Error('Invalid token');
              return getSurvey(response.survey_id);
          });
    const submission = verification.then((response) => getSubmissionByToken(response?.verification_token ?? ''));
    const reportSettings = survey.then((response) => fetchSurveyReportSettings(response.id.toString()));
    const engagement = survey.then((response) => {
        if (!response.engagement_id) return null;
        return getEngagement(response.engagement_id);
    });
    const slug = engagement.then((response) => response && getSlugByEngagementId(response.id));
    return defer({ engagement, language, reportSettings, slug, submission, survey, surveyId, token, verification });
};
