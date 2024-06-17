import { Params, defer } from 'react-router-dom';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { getWidgets } from 'services/widgetService';

export const engagementLoader = async ({ params }: { params: Params<string> }) => {
    const { slug } = params;
    const engagement = getEngagementIdBySlug(slug ?? '').then((response) => getEngagement(response.engagement_id));
    const widgets = engagement.then((response) => getWidgets(response.id));
    return defer({ engagement, slug, widgets });
};
