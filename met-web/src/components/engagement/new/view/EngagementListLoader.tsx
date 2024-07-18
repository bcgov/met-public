import { defer } from 'react-router-dom';
import { getEngagements, GetEngagementsParams } from 'services/engagementService';

export const engagementListLoader = async ({ request }: { request: Request }) => {
    const { searchParams } = new URL(request.url);
    const params: GetEngagementsParams = {
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || undefined,
        sort_key: searchParams.get('sort_key') ?? undefined,
        sort_order: searchParams.get('sort_order') as 'asc' | 'desc',
        search_text: searchParams.get('search_text') ?? undefined,
        engagement_status: searchParams.getAll('engagement_status').map((status) => Number(status)) || undefined,
        created_from_date: searchParams.get('created_from_date') ?? undefined,
        created_to_date: searchParams.get('created_to_date') ?? undefined,
        published_from_date: searchParams.get('published_from_date') ?? undefined,
        published_to_date: searchParams.get('published_to_date') ?? undefined,
    };

    const engagements = getEngagements(params);
    return defer({ engagements });
};
