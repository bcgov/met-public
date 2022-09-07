import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { ConditionalComponent } from '..';
import { LinearProgress } from '@mui/material';

type Order = 'asc' | 'desc';

interface MetTableHeadProps<T> {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T, headCellIndex: number) => void;
    order?: Order;
    orderBy?: keyof T;
    rowCount: number;
    headCells: HeadCell<T>[];
    loading: boolean;
}

function MetTableHead<T>({ order, orderBy, onRequestSort, headCells, loading }: MetTableHeadProps<T>) {
    const createSortHandler = (property: keyof T, headCellIndex: number) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property, headCellIndex);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={`${String(headCell.key)}${index}`}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.key ? order : false}
                        sx={{ borderBottom: '1.5px solid gray', fontWeight: 'bold' }}
                    >
                        <TableSortLabel
                            disabled={!headCell.allowSort || loading}
                            active={orderBy === headCell.key}
                            direction={orderBy === headCell.key ? order : 'asc'}
                            onClick={createSortHandler(headCell.key, index)}
                        >
                            {headCell.label}
                            {orderBy === headCell.key && (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            )}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface MetTableProps<T> {
    headCells: HeadCell<T>[];
    rows: T[];
    hideHeader?: boolean;
    noRowBorder?: boolean;
    handleChangePagination: (pagination: PaginationOptions<T>) => void;
    loading?: boolean;
    paginationOptions: PaginationOptions<T>;
    pageInfo: PageInfo;
}
function MetTable<T>({
    hideHeader = false,
    headCells = [],
    rows = [],
    noRowBorder = false,
    handleChangePagination,
    loading = false,
    paginationOptions,
    pageInfo,
}: MetTableProps<T>) {
    const { page, size, sort_key, sort_order } = paginationOptions;
    const { total } = pageInfo;

    const order = sort_order;
    const orderBy = sort_key;

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof T, headCellIndex: number) => {
        const isAsc = orderBy === property && order === 'asc';
        handleChangePagination({
            ...paginationOptions,
            sort_key: property,
            nested_sort_key: headCells[headCellIndex].nestedSortKey,
            sort_order: isAsc ? 'desc' : 'asc',
        });
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        handleChangePagination({
            ...paginationOptions,
            page: newPage + 1,
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        handleChangePagination({
            ...paginationOptions,
            page: 1,
            size: newSize,
        });
    };

    // Avoid a layout jump when reaching the last page with empty filteredRows.
    const emptyRows = page > 1 ? Math.max(0, page * size - total) : 0;

    return (
        <Box>
            <Paper sx={{ width: '100%', mb: 2 }} elevation={0}>
                <TableContainer>
                    <Table aria-labelledby="Engagements">
                        <ConditionalComponent condition={!hideHeader}>
                            <MetTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                headCells={headCells}
                                loading={loading}
                            />
                        </ConditionalComponent>

                        <TableBody sx={{ position: 'relative' }}>
                            <ConditionalComponent condition={loading}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <LinearProgress />
                                </Box>
                            </ConditionalComponent>
                            {rows.map((row, rowIndex) => {
                                return (
                                    <TableRow hover tabIndex={-1} key={`row-${rowIndex}`}>
                                        {headCells.map((cell, cellIndex) => (
                                            <TableCell
                                                align={cell.align}
                                                key={`row-${rowIndex}-${cellIndex}`}
                                                style={cell.customStyle || {}}
                                                sx={[
                                                    noRowBorder && {
                                                        border: 'none',
                                                    },
                                                ]}
                                            >
                                                {cell.getValue ? cell.getValue(row) : String(row[cell.key])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell
                                        colSpan={headCells.length}
                                        sx={[
                                            noRowBorder && {
                                                border: 'none',
                                            },
                                        ]}
                                    />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Number(total)}
                    rowsPerPage={size}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

export default MetTable;
