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

    const tenantId =
        globalThis !== undefined && typeof globalThis.sessionStorage !== 'undefined'
            ? globalThis.sessionStorage.getItem('tenantId')
            : null;
    const languages = tenantId ? getTenantLanguages(tenantId) : Promise.resolve([]);
    const slug = getSlugByEngagementId(Number(engagementId))
        .then((response) => response.slug)
        .catch(() => '');
    const engagement = getEngagement(Number(engagementId));
    const widgets = engagement.then((response) => getWidgets(Number(response.id)));
    const details = engagement.then((response) => getDetailsTabs(response.id));
    const engagementMetadata = engagement.then((response) => getEngagementMetadata(Number(response.id)));
    const taxaData = getMetadataTaxa();
    const teamMembers = engagement.then((response) => getTeamMembers({ engagement_id: response.id }).catch(() => []));

    const metadata = Promise.all([engagementMetadata, taxaData]).then(([metaResponse, taxaResponse]) => {
        metaResponse.forEach((metaEntry) => {
            const taxon = taxaResponse[metaEntry.taxon_id];
            if (taxon) {
                taxon.entries ??= [];
                taxon.entries.push(metaEntry);
            }
        });
        return metaResponse;
    });

    const taxa = taxaData.then((taxa) => Object.values(taxa));
    const myTenants = getMyTenants();
    const apiVersion = fetchVersion();

    return {
        engagement,
        slug,
        widgets,
        details,
        metadata,
        taxa,
        teamMembers,
        languages,
        tenants: myTenants,
        apiVersion,
    };
};

export default engagementPreviewLoader;
