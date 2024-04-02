import { Survey, SurveySubmissionData } from './survey';
import { EngagementStatusBlock } from './engagementStatusBlock';
import { SubmissionStatus } from 'constants/engagementStatus';

export interface Engagement {
    id: number;
    name: string;
    description: string;
    rich_description: string;
    status_id: number;
    start_date: string;
    end_date: string;
    published_date: string | null;
    user_id: string;
    created_date: string;
    updated_date: string;
    scheduled_date: string;
    content: string;
    rich_content: string;
    banner_url: string;
    banner_filename: string;
    surveys: Survey[];
    engagement_status: Status;
    submission_status: SubmissionStatus;
    submissions_meta_data: SurveySubmissionData;
    status_block: EngagementStatusBlock[];
    is_internal: boolean;
    consent_message: string;
}

export interface Status {
    id: number;
    status_name: string;
}

export interface MetadataTaxonModify {
    name?: string; // The name of the taxon, optional
    description?: string; // The description of the taxon, optional
    freeform?: boolean; // Whether the taxon is freeform, optional
    data_type?: string; // The data type for the taxon, optional
    one_per_engagement?: boolean; // Whether the taxon is limited to one entry per engagement, optional
    preset_values?: string[]; // The preset values for the taxon
    filter_type?: string | null; // The filter type for the taxon, optional
    include_freeform?: boolean; // Whether to include freeform values in options for filtering, optional
}

export interface MetadataTaxon extends MetadataTaxonModify {
    id: number; // The id of the taxon
    tenant_id: number; // The tenant id
    position: number; // The taxon's position within the tenant
    entries?: EngagementMetadata[]; // The content of the taxon
}

export interface EngagementMetadata {
    value: string; // The content of the metadata
    taxon_id: number; // ID of the taxon this metadata is for
    engagement_id?: number; // The ID of the relevant engagement
}

export interface EngagementSettings {
    engagement_id: number;
    send_report: boolean;
}

export const createDefaultEngagement = (): Engagement => {
    return {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        scheduled_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        engagement_status: { id: 0, status_name: '' },
        surveys: [],
        submission_status: SubmissionStatus.Upcoming,
        submissions_meta_data: {
            total: 0,
            pending: 0,
            needs_further_review: 0,
            rejected: 0,
            approved: 0,
        },
        status_block: [],
        is_internal: false,
        consent_message: '',
    };
};

export const createDefaultEngagementSettings = (): EngagementSettings => {
    return {
        engagement_id: 0,
        send_report: true,
    };
};
