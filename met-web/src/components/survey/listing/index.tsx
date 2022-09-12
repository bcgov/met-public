import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Survey } from 'models/survey';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { getSurveysPage } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementStatus } from 'constants/engagementStatus';

const SurveyListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Survey>>({
        page: 1,
        size: 10,
        sort_key: 'name',
        nested_sort_key: 'survey.name',
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());

    const [tableLoading, setTableLoading] = useState(true);

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadSurveys = async () => {
        try {
            setTableLoading(true);
            const response = await getSurveysPage({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
            });
            setSurveys(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching surveys' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadSurveys();
    }, [paginationOptions, searchFilter]);

    const handleSearchBarClick = (surveyNameFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: surveyNameFilter,
        });
    };

    const headCells: HeadCell<Survey>[] = [
        {
            key: 'name',
            nestedSortKey: 'survey.name',
            numeric: false,
            disablePadding: true,
            label: 'Survey Name',
            allowSort: true,
            getValue: (row: Survey) => (
                <MuiLink component={Link} to={`/survey/build/${Number(row.id)}`}>
                    {row.name}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            nestedSortKey: 'survey.created_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Created',
            allowSort: true,
            getValue: (row: Survey) => formatDate(row.created_date),
        },
        {
            key: 'engagement',
            nestedSortKey: 'engagement.published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Survey) => formatDate(row.engagement?.published_date || ''),
        },
        {
            key: 'engagement',
            nestedSortKey: 'engagement.name',
            numeric: true,
            disablePadding: false,
            label: 'Engagement Name',
            allowSort: true,
            getValue: (row: Survey) => {
                if (!row.engagement) {
                    return <></>;
                }

                return (
                    <MuiLink component={Link} to={`/engagement/view/${row.engagement.id}`}>
                        {row.engagement.name}
                    </MuiLink>
                );
            },
        },
        {
            key: 'comments_meta_data',
            numeric: true,
            disablePadding: false,
            label: 'Responses',
            allowSort: false,
            getValue: (row: Survey) => {
                if (!row.comments_meta_data.total) {
                    return 0;
                }

                const { total, pending } = row.comments_meta_data;
                return (
                    <MuiLink component={Link} to={`/survey/${row.id}/comments`}>
                        {`${total}`}
                        {pending ? ` (${pending} New)` : ''}
                    </MuiLink>
                );
            },
        },
        {
            key: 'engagement',
            nestedSortKey: 'engagement.status_id',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            getValue: (row: Survey) =>
                row.engagement?.engagement_status.status_name || EngagementStatus[EngagementStatus.Draft].toString(),
        },
        {
            key: 'id',
            nestedSortKey: 'survey.id',
            numeric: true,
            disablePadding: false,
            label: 'Reporting',
            allowSort: false,
            getValue: (row: Survey) => {
                if (!row.engagement) {
                    return <></>;
                }

                if (row.engagement.engagement_status.id === EngagementStatus.Draft || !row.comments_meta_data.total) {
                    return <></>;
                }

                return (
                    <MuiLink component={Link} to={`/engagement/${Number(row.engagement.id)}/dashboard`}>
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
                            data-testid="SurveyListing/search-button"
                            onClick={() => handleSearchBarClick(searchText)}
                        >
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
                    <PrimaryButton component={Link} to="/survey/create">
                        + Create Survey
                    </PrimaryButton>
                </Stack>
            </Grid>

            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={surveys}
                    noRowBorder={true}
                    handleChangePagination={(paginationOptions: PaginationOptions<Survey>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={tableLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyListing;
