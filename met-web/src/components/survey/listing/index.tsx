import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Survey } from 'models/survey';
import { HeadCell } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { fetchAllSurveys } from 'services/surveyService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const SurveyListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [surveys, setSurveys] = useState<Survey[]>([]);

    const dispatch = useAppDispatch();

    const callFetchSurveys = async () => {
        try {
            const fetchedSurveys = await fetchAllSurveys();
            setSurveys(fetchedSurveys);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching surveys' }));
        }
    };
    useEffect(() => {
        callFetchSurveys();
    }, []);

    const handleSearchBarClick = (engagementNameFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: engagementNameFilter,
        });
    };

    const headCells: HeadCell<Survey>[] = [
        {
            key: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Survey Name',
            allowSort: true,
            getValue: (row: Survey) => (
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
            getValue: (row: Survey) => formatDate(row.created_date),
        },
        {
            key: 'engagement',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            getValue: (row: Survey) => row.engagement?.status.status_name || 'draft',
        },
        {
            key: 'engagement',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Survey) => formatDate(row.engagement?.published_date || ''),
        },
        {
            key: 'responseCount',
            numeric: true,
            disablePadding: false,
            label: 'Responses',
            allowSort: false,
        },
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Reporting',
            allowSort: false,
            getValue: (row: Survey) => (
                <MuiLink component={Link} to={`/survey/${Number(row.id)}/results`}>
                    View Report
                </MuiLink>
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
            <Grid item xs={0} md={4} lg={4}></Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Link to="/survey/create">
                    <Button variant="contained" fullWidth>
                        + Create Survey
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable headCells={headCells} rows={surveys} defaultSort={'created_date'} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyListing;
