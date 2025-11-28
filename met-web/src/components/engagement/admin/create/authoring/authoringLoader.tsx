import { Params } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';

export const authoringLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId } = params;
    const content = getEngagementContent(Number(engagementId));
    return { content };
};
