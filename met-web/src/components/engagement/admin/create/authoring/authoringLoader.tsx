import { Engagement } from 'models/engagement';
import { EngagementContent } from 'models/engagementContent';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { Params } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';
import { getDetailsTabs } from 'services/engagementDetailsTabService';

export type AuthoringLoaderData = {
    engagement: Promise<Engagement>;
    content: Promise<EngagementContent[]>;
    detailsTabs: Promise<EngagementDetailsTab[]>;
};

export const authoringLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId } = params;
    const id = Number(engagementId);

    const contentPromise = getEngagementContent(id);
    const detailsTabsPromise = getDetailsTabs(id);

    return {
        content: contentPromise,
        detailsTabs: detailsTabsPromise,
    };
};
