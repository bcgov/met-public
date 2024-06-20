import { EngagementCustomContent } from 'models/engagementCustomContent';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import { Params, defer } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';
import { getCustomContent } from 'services/engagementCustomService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { getSummaryContent } from 'services/engagementSummaryService';
import { getWidgets } from 'services/widgetService';

const castCustomContentToSummaryContent = (customContent: EngagementCustomContent): EngagementSummaryContent => {
    return {
        id: customContent.id,
        content: customContent.custom_text_content,
        rich_content: customContent.custom_json_content,
        engagement_id: customContent.engagement_id,
        engagement_content_id: customContent.engagement_content_id,
    };
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
                    : getCustomContent(content.id).then((customContent) =>
                          customContent.map((custom) => castCustomContentToSummaryContent(custom)),
                      );
            }),
        ),
    );

    return defer({ engagement, slug, widgets, content, contentSummary });
};
