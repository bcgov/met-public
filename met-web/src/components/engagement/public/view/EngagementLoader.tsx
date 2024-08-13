import { EngagementCustomContent } from 'models/engagementCustomContent';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import { Params, defer } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';
import { getCustomContent } from 'services/engagementCustomService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug, getSlugByEngagementId } from 'services/engagementSlugService';
import { getSummaryContent } from 'services/engagementSummaryService';
import { getWidgets } from 'services/widgetService';
import { getEngagementMetadata, getMetadataTaxa } from 'services/engagementMetadataService';

export const engagementLoader = async ({ params }: { params: Params<string> }) => {
    let { slug } = params;
    const { engagementId } = params;
    if (!slug && engagementId) {
        const response = await getSlugByEngagementId(Number(engagementId));
        slug = response.slug;
    }
    const engagement = getEngagementIdBySlug(slug ?? '').then((response) => getEngagement(response.engagement_id));
    const widgets = engagement.then((response) => getWidgets(Number(response.id)));
    const content = engagement.then((response) => getEngagementContent(response.id));
    const engagementMetadata = engagement.then((response) => getEngagementMetadata(Number(response.id)));
    const taxaData = getMetadataTaxa();

    const metadata = engagementMetadata.then((metaResponse) => {
        taxaData.then((taxaResponse) => {
            metaResponse.forEach((metaEntry) => {
                const taxon = taxaResponse[metaEntry.taxon_id];
                if (taxon) {
                    if (taxon.entries === undefined) {
                        taxon.entries = [];
                    }
                    taxon.entries.push(metaEntry);
                }
            });
        });
        return metaResponse;
    });

    const taxa = taxaData.then((taxa) => Object.values(taxa));

    const contentSummary = content.then((response) =>
        Promise.all(
            response.map((content) => {
                return content.content_type === 'Summary'
                    ? getSummaryContent(Number(content.id)).then(convertArrayToSingleEntry)
                    : getCustomContent(content.id).then(castCustomContentToSummaryContent);
            }),
        ),
    );

    const customContent = content.then((response) =>
        Promise.all(
            response.map((content) => {
                if (content.content_type === 'Custom') return getCustomContent(content.id).then((result) => result[0]);
            }),
        ),
    );

    const convertArrayToSingleEntry = (
        engagementSummaryContent: EngagementSummaryContent[],
    ): EngagementSummaryContent => {
        return engagementSummaryContent[0];
    };

    const castCustomContentToSummaryContent = (customContent: EngagementCustomContent[]): EngagementSummaryContent => {
        const mappedCustomContent = customContent.map((custom) => ({
            id: custom.id,
            content: custom.custom_text_content,
            rich_content: custom.custom_json_content,
            engagement_id: custom.engagement_id,
            engagement_content_id: custom.engagement_content_id,
        }));
        const finishedContent = mappedCustomContent[0];
        return finishedContent;
    };

    return defer({ engagement, slug, widgets, content, contentSummary, metadata, taxa, customContent });
};
