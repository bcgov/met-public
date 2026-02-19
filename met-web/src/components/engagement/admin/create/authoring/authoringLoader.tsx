import { Engagement } from 'models/engagement';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { Survey } from 'models/survey';
import { Params } from 'react-router';
import { getDetailsTabs } from 'services/engagementDetailsTabService';
import { getEngagement } from 'services/engagementService';
import { getSurveysPage } from 'services/surveyService';

export type SurveyData = {
    items: Survey[];
    total: number;
};

export type AuthoringLoaderData = {
    engagement: Promise<Engagement>;
    detailsTabs: Promise<EngagementDetailsTab[]>;
    surveys: Promise<SurveyData>;
};

const authoringLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId } = params;
    const id = Number(engagementId);

    const engagementPromise = getEngagement(id);
    const detailsTabsPromise = getDetailsTabs(id);
    const surveysPromise = getSurveysPage();

    return {
        engagement: engagementPromise,
        detailsTabs: detailsTabsPromise,
        surveys: surveysPromise,
    };
};

export default authoringLoader;
