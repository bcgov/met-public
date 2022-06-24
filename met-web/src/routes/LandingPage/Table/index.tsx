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
import { useAppDispatch, useAppSelector } from 'hooks';
import { fetchAll } from 'services/engagementService';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { EngagementTableCell } from './TableElements';
import { formatDate } from 'components/common/dateHelper';
import { hasKey } from 'utils';
import { Engagement } from 'models/engagement';

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
function getComparator<Key extends keyof Engagement>(
    order: Order,
    orderBy: Key,
): (a: Engagement, b: Engagement) => number {
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

interface HeadCell {
    disablePadding: boolean;
    id: keyof Engagement;
    label: string;
    numeric: boolean;
    allowSort: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Engagement Name',
        allowSort: true,
    },
    {
        id: 'created_date',
        numeric: true,
        disablePadding: false,
        label: 'Date Created',
        allowSort: true,
    },
    {
        id: 'status_id',
        numeric: true,
        disablePadding: false,
        label: 'Status',
        allowSort: true,
    },
    {
        id: 'published_date',
        numeric: true,
        disablePadding: false,
        label: 'Date Published',
        allowSort: true,
    },
    {
        id: 'survey',
        numeric: false,
        disablePadding: false,
        label: 'Survey',
        allowSort: false,
    },
    {
        id: 'survey',
        numeric: true,
        disablePadding: false,
        label: 'Responses',
        allowSort: false,
    },
    {
        id: 'survey',
        numeric: true,
        disablePadding: false,
        label: 'Reporting',
        allowSort: false,
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Engagement) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof Engagement) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={`${headCell.id}${index}`}
                        align={'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ borderBottom: '1.5px solid gray' }}
                    >
                        <TableSortLabel
                            disabled={!headCell.allowSort}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id && (
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

function EnhancedTable({ filter = { key: '', value: '' } }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchAll(dispatch);
    }, [dispatch]);

    const rows = useAppSelector<Engagement[]>((state) => state.engagement.allEngagements);

    const [filteredRows, setFilteredRows] = useState<any[]>(rows);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Engagement>('created_date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if (!filter.key || !filter.value) {
            setFilteredRows(rows);
            return;
        }

        const rowsFilteredResults = rows.filter((row: Engagement) => {
            if (!hasKey(row, filter.key)) {
                return false;
            }
            // filter by rows who have the specified field in filter.key matching the search filter value
            return String(row[filter.key]).match(`${filter.value}.*`);
        });
        setFilteredRows(rowsFilteredResults);
    }, [rows, filter]);

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Engagement) => {
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
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                        />
                        <TableBody>
                            {stableSort<Engagement>(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={row.id}>
                                            <EngagementTableCell align="left">
                                                <MuiLink component={Link} to={`/engagement/form/${Number(row.id)}`}>
                                                    {row.name}
                                                </MuiLink>
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {formatDate(row.created_date)}
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {row.status.status_name}
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {formatDate(row.published_date)}
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {!row.survey && 'No Survey'}
                                                <MuiLink component={Link} to={`/survey/${Number(row.survey?.id)}`}>
                                                    {row.survey?.name}
                                                </MuiLink>
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {!row.survey && 'N/A'}
                                                {row.survey?.responseCount}
                                            </EngagementTableCell>
                                            <EngagementTableCell align="left">
                                                {!row.survey && 'N/A'}
                                                {row.survey && (
                                                    <MuiLink
                                                        component={Link}
                                                        to={`/survey/${Number(row.survey?.id)}/results`}
                                                    >
                                                        View Report
                                                    </MuiLink>
                                                )}
                                            </EngagementTableCell>
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

export default EnhancedTable;
