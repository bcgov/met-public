import { Engagement } from 'models/engagement';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { Params } from 'react-router-dom';
import { getDetailsTabs } from 'services/engagementDetailsTabService';

export type AuthoringLoaderData = {
    engagement: Promise<Engagement>;
    detailsTabs: Promise<EngagementDetailsTab[]>;
};

const authoringLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId } = params;
    const id = Number(engagementId);

    const detailsTabsPromise = getDetailsTabs(id);

    return {
        detailsTabs: detailsTabsPromise,
    };
};

export default authoringLoader;
