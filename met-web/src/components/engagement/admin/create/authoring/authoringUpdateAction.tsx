import { ActionFunction, redirect } from 'react-router-dom';
import { patchEngagement } from 'services/engagementService';
import { patchEngagementMetadata } from 'services/engagementMetadataService';
import { patchEngagementSettings } from 'services/engagementSettingService';
import { patchEngagementSlug } from 'services/engagementSlugService';
import { EngagementStatusBlock } from 'models/engagementStatusBlock';
import { patchDetailsTabs } from 'services/engagementDetailsTabService';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';

export const authoringUpdateAction: ActionFunction = async ({ request }) => {
    const formData = (await request.formData()) as FormData;
    const errors = [];
    const requestType = formData.get('request_type') as string;
    const engagementId = Number(formData.get('id'));
    const statusBlock = [
        {
            survey_status: 'Open',
            button_text: formData.get('open_cta') as string,
            link_type: formData.get('open_cta_link_type') as string,
            internal_link: formData.get('open_section_link') as string,
            external_link: formData.get('open_external_link') as string,
        },
        {
            survey_status: 'ViewResults',
            button_text: formData.get('view_results_cta') as string,
            link_type: formData.get('view_results_link_type') as string,
            internal_link: formData.get('view_results_section_link') as string,
            external_link: formData.get('view_results_external_link') as string,
        },
        {
            survey_status: 'Closed',
            block_text: formData.get('closed_message') as string,
            link_type: 'none',
        },
        {
            survey_status: 'Upcoming',
            block_text: formData.get('upcoming_message') as string,
            link_type: 'none',
        },
    ] as EngagementStatusBlock[];

    // Update engagement if necessary.
    if (formData.get('form_source') === 'banner' || formData.get('form_source') === 'summary') {
        try {
            await patchEngagement({
                id: Number(formData.get('id')) as unknown as number,
                name: (formData.get('name') as string) || undefined,
                sponsor_name: (formData.get('eyebrow') as string) || undefined,
                start_date: (formData.get('start_date') as string) || undefined,
                status_id: (Number(formData.get('status_id')) as unknown as number) || undefined,
                end_date: (formData.get('end_date') as string) || undefined,
                description: (formData.get('description') as string) || undefined,
                rich_description: (formData.get('rich_description') as string) || undefined,
                description_title: (formData.get('description_title') as string) || undefined,
                banner_filename: (formData.get('banner_filename') as string) || undefined,
                status_block: statusBlock,
            });
        } catch (e) {
            console.error('Error updating engagement', e);
            errors.push(e);
        }
    }

    // Update engagement details tabs if necessary.
    if (formData.get('form_source') === 'details' && formData.get('details_tabs') !== '[]') {
        try {
            const tabs = formData.get('details_tabs') as unknown as string;
            const parsedTabs = JSON.parse(tabs) as unknown as EngagementDetailsTab[];
            const typedTabs = parsedTabs?.map((t) => ({
                id: Number(t.id) >= 0 ? Number(t.id) : -1,
                engagement_id: engagementId,
                label: t.label || undefined,
                slug: t.slug || undefined,
                heading: t.heading || undefined,
                body: t.body || undefined,
                sort_index: t.sort_index || undefined,
            })) as unknown as EngagementDetailsTab[];
            await patchDetailsTabs(engagementId, typedTabs);
        } catch (e) {
            console.error('Error updating engagement details tabs', e);
            errors.push(e);
        }
    }

    // Update engagement metadata if necessary.
    if (formData.get('metadata_value') && formData.get('taxon_id')) {
        try {
            await patchEngagementMetadata({
                value: formData.get('metadata_value') as string,
                taxon_id: Number(formData.get('taxon_id')) as unknown as number,
                engagement_id: engagementId,
            });
        } catch (e) {
            console.error('Error updating engagement metadata', e);
            errors.push(e);
        }
    }

    // Update engagement settings if necessary.
    if (formData.get('send_report')) {
        try {
            await patchEngagementSettings({
                engagement_id: engagementId,
                send_report: 'true' === formData.get('send_report'),
            });
        } catch (e) {
            console.error('Error updating engagement settings', e);
            errors.push(e);
        }
    }

    // Update engagement slug if necessary.
    if (formData.get('slug')) {
        try {
            await patchEngagementSlug({
                engagement_id: engagementId,
                slug: formData.get('slug') as string,
            });
        } catch (e) {
            console.error('Error updating engagement slug', e);
            errors.push(e);
        }
    }

    if (0 === errors.length && 'preview' === requestType) {
        return redirect(`../../../old-view`);
    } else if (0 === errors.length && 'update' === requestType) {
        return 'success';
    } else {
        return 'failure';
    }
};

export default authoringUpdateAction;
