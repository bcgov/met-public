import { PaginationOptions } from './types';

export function updateURLWithPagination<T>(paginationOptions: PaginationOptions<T>) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', paginationOptions.page.toString());
    url.searchParams.set('size', paginationOptions.size.toString());
    window.history.replaceState({}, '', url.toString());
}
