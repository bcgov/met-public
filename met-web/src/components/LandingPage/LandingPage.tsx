import React, { useState, useEffect } from 'react';
import MetTable from '../common/Table';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton } from '../common';
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
            getValue: (row: Engagement) => row.engagement_status.status_name,
        },
        {
            key: 'published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Engagement) => {
                if (row.published_date === 'None' || !row.published_date) {
                    return '';
                }
                return formatDate(row.published_date);
            },
        },
        {
            key: 'surveys',
            numeric: false,
            disablePadding: false,
            label: 'Survey',
            allowSort: false,
            getValue: (row: Engagement) => {
                if (row.surveys.length === 0) {
                    return '';
                }

                return (
                    <MuiLink component={Link} to={`/survey/submit/${Number(row.surveys[0].id)}`}>
                        View Survey
                    </MuiLink>
                );
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: 'Submissions',
            allowSort: false,
            getValue: (row: Engagement) => {
                if (!row.submissions_meta_data.total) {
                    return 0;
                }
                const { total } = row.submissions_meta_data;
                return `${total}`;
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: 'Reporting',
            allowSort: false,
            getValue: (row: Engagement) => {
                if (row.surveys.length === 0 || row.submissions_meta_data.total === 0) {
                    return '';
                }

                return (
                    <MuiLink component={Link} to={`/engagement/${Number(row.id)}/dashboard`}>
                        View Report
                    </MuiLink>
                );
            },
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
            <Grid item xs={12} lg={10}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            id="engagement-name"
                            variant="outlined"
                            label="Search by name"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                        />
                        <PrimaryButton
                            data-testid="search-button-landingPage"
                            onClick={() => handleSearchBarClick(searchText)}
                        >
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
                    <PrimaryButton
                        component={Link}
                        to="/engagement/form/create"
                        data-testid="create-engagement-button-landingPage"
                    >
                        + Create Engagement
                    </PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    filter={searchFilter}
                    headCells={headCells}
                    rows={rows}
                    defaultSort={'created_date'}
                    noRowBorder={true}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default LandingPage;
