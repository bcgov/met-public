import { Params } from 'react-router';
import { getEngagement } from 'services/engagementService';
import { getEngagementIdBySlug, getSlugByEngagementId } from 'services/engagementSlugService';
import { getWidgets } from 'services/widgetService';
import { getEngagementMetadata, getMetadataTaxa } from 'services/engagementMetadataService';
import { Engagement, EngagementMetadata, MetadataTaxon } from 'models/engagement';
import { Widget } from 'models/widget';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { getDetailsTabs } from 'services/engagementDetailsTabService';
import { getTenantLanguages } from 'services/languageService';
import { Language } from 'models/language';
import { SuggestedEngagementWithAttachment } from 'models/suggestedEngagement';
import { getSuggestedEngagements } from 'services/suggestedEngagementService';

export type EngagementLoaderPublicData = {
    engagement: Promise<Engagement>;
    slug: Promise<string>;
    widgets: Promise<Widget[]>;
    details: Promise<EngagementDetailsTab[]>;
    metadata: Promise<EngagementMetadata[]>;
    taxa: Promise<MetadataTaxon[]>;
    languages: Promise<Language[]>;
    suggestions: Promise<SuggestedEngagementWithAttachment[]>;
};

export const engagementLoaderPublic = async ({ params }: { params: Params<string> }) => {
    const { slug: slugParam, engagementId } = params;

    const tenantId =
        typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
            ? window.sessionStorage.getItem('tenantId')
            : null;
    const languages = tenantId ? getTenantLanguages(tenantId) : Promise.resolve([]);
    const slug = slugParam
        ? Promise.resolve(slugParam)
        : await getSlugByEngagementId(Number(engagementId)).then((response) => response.slug);
    const engagement = slugParam
        ? await getEngagementIdBySlug(slugParam).then(async (response) => await getEngagement(response.engagement_id))
        : await getEngagement(Number(engagementId));
    const widgets = getWidgets(engagement.id);
    const details = getDetailsTabs(engagement.id);
    const suggestions = getSuggestedEngagements(engagement.id, true); // Attach engagement set to true

    // Retrieve taxa and meta data
    const engagementMetadata = await getEngagementMetadata(engagement.id);
    const taxaData = await getMetadataTaxa();
    const metadataPresent = engagementMetadata && Array.isArray(engagementMetadata) && engagementMetadata.length > 0;
    const taxaDataPresent = taxaData && Array.isArray(taxaData) && taxaData.length > 0;
    const metadata =
        metadataPresent && taxaDataPresent
            ? engagementMetadata.forEach((md) => {
                  const taxon = taxaData[md.taxon_id];
                  if (taxon) {
                      if (taxon.entries === undefined) {
                          taxon.entries = [];
                      }
                      taxon.entries.push(md);
                  }
              })
            : {};
    const taxa = taxaDataPresent ? Object.values(taxaData) : {};

    return {
        engagement: Promise.resolve(engagement),
        slug,
        widgets,
        details,
        metadata: Promise.resolve(metadata),
        taxa: Promise.resolve(taxa),
        languages,
        suggestions,
    };
};

export default engagementLoaderPublic;
