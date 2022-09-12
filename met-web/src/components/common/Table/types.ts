export interface HeadCell<T> {
    disablePadding: boolean;
    key: keyof T;
    nestedSortKey?: string;
    label: string;
    numeric: boolean;
    allowSort: boolean;
    getValue?: (row: T) => string | number | JSX.Element;
    customStyle?: React.CSSProperties;
    align?: 'right' | 'left' | 'inherit' | 'center' | 'justify';
}

export interface PaginationOptions<T> {
    page: number;
    size: number;
    sort_key?: keyof T;
    nested_sort_key?: string | null;
    sort_order?: 'asc' | 'desc';
}

export interface PageInfo {
    total: number;
}

export const createDefaultPageInfo = (): PageInfo => {
    return {
        total: 0,
    };
};
