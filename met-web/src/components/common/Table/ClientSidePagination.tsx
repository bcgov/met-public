import React from 'react';
import { MetTableProps } from '.';
import { HeadCell, PaginationOptions } from './types';
import { set } from 'lodash';

interface ClientSidePaginationProps<T> {
    rows: T[];
    children: (props: MetTableProps<T>) => React.ReactElement<MetTableProps<T>>;
}

export function ClientSidePagination<T>({ rows, children }: ClientSidePaginationProps<T>) {
    const [paginationOptions, setPaginationOptions] = React.useState<PaginationOptions<T>>({
        page: 1,
        size: 10, // default page size
    });
    const [pageInfo, setPageInfo] = React.useState({ total: rows.length });
    const [filteredRows, setFilteredRows] = React.useState<T[]>([]);

    const handleChangePagination = (newPaginationOptions: PaginationOptions<T>) => {
        const { page, size } = newPaginationOptions;
        const rowsFiltered = rows.slice((page - 1) * size, page * size);
        setPaginationOptions(newPaginationOptions);
        setPageInfo({ total: rows.length });
        setFilteredRows(rowsFiltered);
    };

    const metTableComponent = children({
        rows: filteredRows, // Use the filtered rows for rendering
        loading: false,
        handleChangePagination,
        paginationOptions,
        pageInfo,
        headCells: [],
    });

    return <>{metTableComponent}</>;
}
