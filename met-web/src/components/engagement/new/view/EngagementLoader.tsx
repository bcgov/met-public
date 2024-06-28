import { EngagementCustomContent } from 'models/engagementCustomContent';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import { Params, defer } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';
import { getCustomContent } from 'services/engagementCustomService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { getSummaryContent } from 'services/engagementSummaryService';
import { getWidgets } from 'services/widgetService';

const castCustomContentToSummaryContent = (customContent: EngagementCustomContent[]): EngagementSummaryContent[] => {
    return customContent.map((custom) => ({
        id: custom.id,
        content: custom.custom_text_content,
        rich_content: custom.custom_json_content,
        engagement_id: custom.engagement_id,
        engagement_content_id: custom.engagement_content_id,
    }));
};

export const engagementLoader = async ({ params }: { params: Params<string> }) => {
    const { slug } = params;
    const engagement = getEngagementIdBySlug(slug ?? '').then((response) => getEngagement(response.engagement_id));
    const widgets = engagement.then((response) => getWidgets(response.id));
    const content = engagement.then((response) => getEngagementContent(response.id));
    const contentSummary = content.then((response) =>
        Promise.all(
            response.map((content) => {
                return content.content_type === 'Summary'
                    ? getSummaryContent(content.id)
                    : getCustomContent(content.id).then(castCustomContentToSummaryContent);
            }),
        ),
    );

    return defer({ engagement, slug, widgets, content, contentSummary });
};
