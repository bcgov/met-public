import { Params, defer } from 'react-router-dom';
import { getEngagements, GetEngagementsParams } from 'services/engagementService';

export const engagementListLoader = async ({ params }: { params: Params<string> }) => {
    const searchParams = new URLSearchParams(location.search);
    const page = Number(searchParams.get('page'));
    const size = Number(searchParams.get('size'));
    const sort_key = searchParams.get('sort_key');
    const sort_order = searchParams.get('sort_order');
    const search_text = searchParams.get('search_text');
    const engagement_status = searchParams.get('engagement_status')?.split('_');
    const created_from_date = searchParams.get('created_from_date');
    const created_to_date = searchParams.get('created_to_date');
    const published_from_date = searchParams.get('published_from_date');
    const published_to_date = searchParams.get('published_to_date');

    const engagementStatusNumberArray: number[] = [];

    engagement_status &&
        engagement_status.map((status: string) => {
            engagementStatusNumberArray.push(Number(status));
        });

    const request: GetEngagementsParams = {
        page: page || 1,
        size: size || undefined,
        sort_key: sort_key || undefined,
        sort_order: (sort_order as 'asc') || 'desc' || undefined,
        search_text: search_text || undefined,
        engagement_status: engagementStatusNumberArray || undefined,
        created_from_date: created_from_date || undefined,
        created_to_date: created_to_date || undefined,
        published_from_date: published_from_date || undefined,
        published_to_date: published_to_date || undefined,
    };

    const engagements = getEngagements(request);
    return defer({ engagements });
};
