import { Engagement } from 'models/engagement';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { SuggestedEngagement } from 'models/suggestedEngagement';
import { Survey } from 'models/survey';
import { Params } from 'react-router';
import { getDetailsTabs } from 'services/engagementDetailsTabService';
import { getEngagement, getEngagements } from 'services/engagementService';
import { getSuggestedEngagements } from 'services/suggestedEngagementService';
import { getSurveysPage } from 'services/surveyService';
import { Page } from 'services/type';

export type SurveyData = {
    items: Survey[];
    total: number;
};

export type AuthoringLoaderData = {
    engagement: Promise<Engagement>;
    engagementList: Promise<Page<Engagement>>;
    detailsTabs: Promise<EngagementDetailsTab[]>;
    surveys: Promise<SurveyData>;
    suggestions: Promise<SuggestedEngagement[]>;
};

const authoringLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId, tenantId } = params;
    const id = Number(engagementId);
    const tId = Number(tenantId);

    const engagementPromise = getEngagement(id);
    // Retrieves a maximum of 1000 engagements
    const engagementListPromise = getEngagements({ size: 1000, tenant_id: tId });
    const detailsTabsPromise = getDetailsTabs(id);
    const surveysPromise = getSurveysPage();
    const suggestionsPromise = getSuggestedEngagements(id);

    return {
        engagement: engagementPromise,
        engagementList: engagementListPromise,
        detailsTabs: detailsTabsPromise,
        surveys: surveysPromise,
        suggestions: suggestionsPromise,
    };
};

export default authoringLoader;
