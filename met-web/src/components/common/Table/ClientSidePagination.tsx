import React, { useEffect } from 'react';
import { MetTableProps } from '.';
import { PaginationOptions } from './types';

interface ClientSidePaginationProps<T> {
    rows: T[];
    searchFilter?: {
        key: keyof T;
        value: string;
    };
    children: (props: MetTableProps<T>) => React.ReactElement<MetTableProps<T>>;
}

export function ClientSidePagination<T>({ rows, searchFilter, children }: ClientSidePaginationProps<T>) {
    const [paginationOptions, setPaginationOptions] = React.useState<PaginationOptions<T>>({
        page: 1,
        size: 10, // default page size
    });
    const [pageInfo, setPageInfo] = React.useState({ total: rows.length });
    const [filteredRows, setFilteredRows] = React.useState<T[]>(rows);

    const handleChangePagination = (newPaginationOptions: PaginationOptions<T>) => {
        const { page, size } = newPaginationOptions;
        const rowsFiltered = filteredRows.slice((page - 1) * size, page * size);
        setPaginationOptions(newPaginationOptions);
        setPageInfo({ total: rows.length });
        setFilteredRows(rowsFiltered);
    };

    const handleFilter = (filterKey: keyof T, filterValue: string) => {
        const filteredRows = rows.filter((row) => String(row[filterKey]).includes(filterValue));
        const newTotal = filteredRows.length;
        setFilteredRows(filteredRows);
        setPageInfo({ total: newTotal });
        setPaginationOptions({ ...paginationOptions, page: 1 });
    };

    useEffect(() => {
        if (searchFilter) {
            handleFilter(searchFilter.key, searchFilter.value);
        }
    }, [searchFilter]);

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
