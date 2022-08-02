import React, { useEffect, useState } from 'react';
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
import { MetTableCell } from './TableElements';
import { HeadCell } from 'components/common/Table/types';
import { hasKey } from 'utils';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

// eslint-disable-next-line
function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface MetTableHeadProps<T> {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    order: Order;
    orderBy: keyof T;
    rowCount: number;
    headCells: HeadCell<T>[];
}

function MetTableHead<T>(props: MetTableHeadProps<T>) {
    const { order, orderBy, onRequestSort, headCells } = props;

    const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={`${String(headCell.key)}${index}`}
                        align={'left'}
                        sortDirection={orderBy === headCell.key ? order : false}
                        sx={{ borderBottom: '1.5px solid gray', fontWeight: 'bold' }}
                    >
                        <TableSortLabel
                            disabled={!headCell.allowSort}
                            active={orderBy === headCell.key}
                            direction={orderBy === headCell.key ? order : 'asc'}
                            onClick={createSortHandler(headCell.key)}
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
    filter?: {
        key: string;
        value: string;
    };
    headCells: HeadCell<T>[];
    defaultSort: keyof T;
    rows: T[];
    hideHeader: boolean;
    ref: React.Ref<MetTable>;
}
function MetTable<T>({
    ref,
    hideHeader,
    filter = { key: '', value: '' },
    headCells = [],
    defaultSort,
    rows = [],
}: MetTableProps<T>) {
    const [filteredRows, setFilteredRows] = useState<T[]>(rows);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState(defaultSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (!filter.key || !filter.value) {
            setFilteredRows(rows);
            return;
        }

        const rowsFilteredResults = rows.filter((row: T) => {
            if (!hasKey(row, filter.key)) {
                return false;
            }
            // filter by rows who have the specified field in filter.key matching the search filter value
            return String(row[filter.key]).toLowerCase().match(`${filter.value.toLowerCase()}.*`);
        });
        setFilteredRows(rowsFilteredResults);
    }, [rows, filter]);

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof T) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty filteredRows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

    return (
        <Box>
            <Paper sx={{ width: '100%', mb: 2 }} elevation={0}>
                <TableContainer>
                    <Table aria-labelledby="Engagements">
                        {hideHeader ? (
                            <></>
                        ) : (
                            <MetTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={filteredRows.length}
                                headCells={headCells}
                            />
                        )}

                        <TableBody>
                            {stableSort<T>(filteredRows, getComparator<T>(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={`row-${rowIndex}`}>
                                            {headCells.map((cell, cellIndex) => (
                                                <MetTableCell key={`row-${rowIndex}-${cellIndex}`}>
                                                    {cell.getValue ? cell.getValue(row) : String(row[cell.key])}
                                                </MetTableCell>
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
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

export default MetTable;
