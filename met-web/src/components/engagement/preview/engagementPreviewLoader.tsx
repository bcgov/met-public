import { Params } from 'react-router';
import { getEngagement } from 'services/engagementService';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getWidgets } from 'services/widgetService';
import { getEngagementMetadata, getMetadataTaxa } from 'services/engagementMetadataService';
import { Engagement, EngagementMetadata, MetadataTaxon } from 'models/engagement';
import { Widget } from 'models/widget';
import { getTeamMembers } from 'services/membershipService';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { getDetailsTabs } from 'services/engagementDetailsTabService';
import { getTenantLanguages } from 'services/languageService';
import { Language } from 'models/language';
import { Tenant } from 'models/tenant';
import { fetchVersion } from 'services/versionService';
import { getMyTenants } from 'services/tenantService';
import { SuggestedEngagementWithAttachment } from 'models/suggestedEngagement';
import { getSuggestedEngagements } from 'services/suggestedEngagementService';

export type EngagementPreviewLoaderData = {
    engagement: Promise<Engagement>;
    slug: Promise<string>;
    widgets: Promise<Widget[]>;
    details: Promise<EngagementDetailsTab[]>;
    metadata: Promise<EngagementMetadata[]>;
    taxa: Promise<MetadataTaxon[]>;
    teamMembers: Promise<EngagementTeamMember[]>;
    languages: Promise<Language[]>;
    tenants: Promise<Tenant[]>;
    apiVersion: Promise<string>;
    suggestions: Promise<SuggestedEngagementWithAttachment[]>;
};

/**
 * Loader for the engagement preview page.
 * Loads all necessary data for previewing an engagement.
 * Similar to the public engagement loader but uses engagement ID instead of slug.
 */
export const engagementPreviewLoader = async ({ params }: { params: Params<string> }) => {
    const { engagementId } = params;

    if (!engagementId) {
        throw new Error('Engagement ID is required');
    }

    const tenantId = globalThis?.sessionStorage?.getItem('tenantId') || null;

    const languages = tenantId ? getTenantLanguages(tenantId) : Promise.resolve([]);
    const slug = getSlugByEngagementId(Number(engagementId))
        .then((response) => response.slug)
        .catch(() => '');
    const engagement = await getEngagement(Number(engagementId));
    const widgets = getWidgets(engagement.id);
    const details = getDetailsTabs(engagement.id);
    const teamMembers = getTeamMembers({ engagement_id: engagement.id }).catch(() => []);
    const suggestions = getSuggestedEngagements(engagement.id, true); // Passing true to attach engagement data
    const myTenants = getMyTenants();
    const apiVersion = fetchVersion();

    // Get meta and taxa data
    const taxaData = await getMetadataTaxa();
    const engagementMetadata = await getEngagementMetadata(engagement.id);
    const taxaDataPresent = taxaData && Array.isArray(taxaData) && taxaData.length > 0;
    const metadataPresent = engagementMetadata && Array.isArray(engagementMetadata) && engagementMetadata.length > 0;
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
        teamMembers,
        languages,
        tenants: myTenants,
        apiVersion,
        suggestions,
    };
};

export default engagementPreviewLoader;
