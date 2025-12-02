import { Params } from 'react-router-dom';
import { getEngagementContent } from 'services/engagementContentService';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug, getSlugByEngagementId } from 'services/engagementSlugService';
import { getWidgets } from 'services/widgetService';
import { getEngagementMetadata, getMetadataTaxa } from 'services/engagementMetadataService';
import { Engagement, EngagementMetadata, MetadataTaxon } from 'models/engagement';
import { Widget } from 'models/widget';
import { EngagementContent } from 'models/engagementContent';
import { getTeamMembers } from 'services/membershipService';
import { EngagementTeamMember } from 'models/engagementTeamMember';

export type EngagementLoaderData = {
    engagement: Promise<Engagement>;
    slug: Promise<string>;
    widgets: Promise<Widget[]>;
    content: Promise<EngagementContent[]>;
    metadata: Promise<EngagementMetadata[]>;
    taxa: Promise<MetadataTaxon[]>;
    teamMembers: Promise<EngagementTeamMember[]>;
};

export const engagementLoader = async ({ params }: { params: Params<string> }) => {
    const { slug: slugParam, engagementId } = params;
    const slug = slugParam
        ? Promise.resolve(slugParam)
        : getSlugByEngagementId(Number(engagementId)).then((response) => response.slug);
    const engagement = slugParam
        ? getEngagementIdBySlug(slugParam).then((response) => getEngagement(response.engagement_id))
        : getEngagement(Number(engagementId));
    const widgets = engagement.then((response) => getWidgets(Number(response.id)));
    const content = engagement.then((response) => getEngagementContent(response.id));
    const engagementMetadata = engagement.then((response) => getEngagementMetadata(Number(response.id)));
    const taxaData = getMetadataTaxa();
    const teamMembers = engagement.then((response) => getTeamMembers({ engagement_id: response.id }).catch(() => []));

    const metadata = Promise.all([engagementMetadata, taxaData]).then(([metaResponse, taxaResponse]) => {
        metaResponse.forEach((metaEntry) => {
            const taxon = taxaResponse[metaEntry.taxon_id];
            if (taxon) {
                if (taxon.entries === undefined) {
                    taxon.entries = [];
                }
                taxon.entries.push(metaEntry);
            }
        });
        return metaResponse;
    });

    const taxa = taxaData.then((taxa) => Object.values(taxa));

    return {
        engagement,
        slug,
        widgets,
        content,
        metadata,
        taxa,
        teamMembers,
    };
};

export default engagementLoader;
