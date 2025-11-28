import { getUserList, GetUserListParams } from 'services/userService/api';

export const userSearchLoader = ({ request }: { request: Request }) => {
    const url = new URL(request.url);

    const searchOptions: GetUserListParams = {
        search_text: url.searchParams.get('searchTerm') as string,
        include_roles: url.searchParams.get('includeRoles') === 'true',
        sort_key: url.searchParams.get('sortKey') as string,
        sort_order: url.searchParams.get('sortOrder') as 'asc' | 'desc',
        page: Number(url.searchParams.get('page')),
        size: Number(url.searchParams.get('size')),
        include_inactive: url.searchParams.get('include_inactive') === 'true',
    };

    const users = getUserList(searchOptions);
    return { users };
};
