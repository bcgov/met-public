import { Survey } from './survey';
import { Status } from './status';

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
    surveys?: Survey[];
    engagement_status: Status;
}
