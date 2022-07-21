import { Survey } from './survey';
import { Status } from './status';
import { HearingStatus } from 'constants/engagementStatus';

export interface Engagement {
    id: number;
    name: string;
    description: string;
    rich_description: string;
    status_id: number;
    start_date: string;
    end_date: string;
    published_date: string;
    user_id: string;
    created_date: string;
    updated_date: string;
    content: string;
    rich_content: string;
    banner_url: string;
    banner_filename: string;
    surveys: Survey[];
    engagement_status: Status;
    hearing_status: HearingStatus;
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
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        engagement_status: { id: 0, status_name: '' },
        surveys: [],
        hearing_status: HearingStatus.Upcoming,
    };
};
