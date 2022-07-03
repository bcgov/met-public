import React, { useState } from 'react';
import EnhancedTable from './Table';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { MetPageGridContainer } from '../common';
import { Engagement } from 'models/engagement';
import { useAppSelector } from 'hooks';
import { HeadCell } from './types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';

const LandingPage = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });

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
            <Grid item xs={12} md={4} lg={3}>
                <SearchBar onClick={handleSearchBarClick} />
            </Grid>
            <Grid item xs={0} md={4} lg={4}></Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Link to="/engagement/form/create">
                    <Button variant="contained" fullWidth>
                        + Create An Engagement
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12} lg={10}>
                <EnhancedTable filter={searchFilter} headCells={headCells} rows={rows} defaultSort={'created_date'} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default LandingPage;
