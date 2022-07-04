import React, { useState, useEffect } from 'react';
import MetTable from '../common/Table';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from '../common';
import { Engagement } from 'models/engagement';
import { useAppSelector, useAppDispatch } from 'hooks';
import { HeadCell } from '../common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import { fetchAll } from 'services/engagementService';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';

const LandingPage = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchAll(dispatch);
    }, [dispatch]);

    const rows = useAppSelector<Engagement[]>((state) => state.engagement.allEngagements);

    const handleSearchBarClick = (engagementNameFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: engagementNameFilter,
        });
    };

    const headCells: HeadCell<Engagement>[] = [
        {
            key: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Engagement Name',
            allowSort: true,
            getValue: (row: Engagement) => (
                <MuiLink component={Link} to={`/engagement/form/${Number(row.id)}`}>
                    {row.name}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Created',
            allowSort: true,
            getValue: (row: Engagement) => formatDate(row.created_date),
        },
        {
            key: 'status_id',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            getValue: (row: Engagement) => row.status.status_name,
        },
        {
            key: 'published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Engagement) => formatDate(row.published_date),
        },
        {
            key: 'survey',
            numeric: false,
            disablePadding: false,
            label: 'Survey',
            allowSort: false,
            getValue: (row: Engagement) => (
                <>
                    {!row.survey && 'No Survey'}
                    <MuiLink component={Link} to={`/survey/${Number(row.survey?.id)}`}>
                        {row.survey?.name}
                    </MuiLink>
                </>
            ),
        },
        {
            key: 'survey',
            numeric: true,
            disablePadding: false,
            label: 'Responses',
            allowSort: false,
            getValue: (row: Engagement) => (
                <>
                    {!row.survey && 'N/A'}
                    {row.survey?.responseCount}
                </>
            ),
        },
        {
            key: 'survey',
            numeric: true,
            disablePadding: false,
            label: 'Reporting',
            allowSort: false,
            getValue: (row: Engagement) => (
                <>
                    {!row.survey && 'N/A'}
                    {row.survey && (
                        <MuiLink component={Link} to={`/survey/${Number(row.survey?.id)}/results`}>
                            View Report
                        </MuiLink>
                    )}
                </>
            ),
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} md={4} lg={4}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        id="engagement-name"
                        variant="outlined"
                        label="Search by name"
                        fullWidth
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="small"
                    />
                    <Button variant="contained" onClick={() => handleSearchBarClick(searchText)}>
                        <SearchIcon />
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={0} md={4} lg={3}></Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Link to="/engagement/form/create">
                    <Button variant="contained" fullWidth>
                        + Create An Engagement
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable filter={searchFilter} headCells={headCells} rows={rows} defaultSort={'created_date'} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default LandingPage;
