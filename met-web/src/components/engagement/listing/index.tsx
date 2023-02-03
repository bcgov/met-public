import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { Link } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import { Engagement } from 'models/engagement';
import { useAppDispatch } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import { getEngagements } from 'services/engagementService';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';
import AdvancedSearch from './AdvancedSearch/SearchComponent';
import { SearchOptions } from './AdvancedSearch/SearchTypes';

const EngagementListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Engagement>>({
        page: 1,
        size: 10,
        sort_key: 'created_date',
        nested_sort_key: 'engagement.created_date',
        sort_order: 'desc',
    });

    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);

    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        status_list: [],
        created_from_date: '',
        created_to_date: '',
        published_from_date: '',
        published_to_date: '',
    });

    const filterParams = (
        selectedStatus: number[],
        createdFromDate: string,
        createdToDate: string,
        publishedFromDate: string,
        publishedToDate: string,
    ): void => {
        setSearchOptions({
            ...searchOptions,
            status_list: selectedStatus,
            created_from_date: createdFromDate,
            created_to_date: createdToDate,
            published_from_date: publishedFromDate,
            published_to_date: publishedToDate,
        });
    };

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    useEffect(() => {
        loadEngagements();
    }, [paginationOptions, searchFilter, searchOptions]);

    const loadEngagements = async () => {
        try {
            setTableLoading(true);
            const response = await getEngagements({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
                engagement_status: searchOptions.status_list,
                created_from_date: searchOptions.created_from_date,
                created_to_date: searchOptions.created_to_date,
                published_from_date: searchOptions.published_from_date,
                published_to_date: searchOptions.published_to_date,
            });
            setEngagements(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch engagements, please refresh the page or try again at a later time',
                }),
            );
            setTableLoading(false);
        }
    };

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
                <MuiLink component={Link} to={`/engagements/${Number(row.id)}/form`}>
                    {row.name}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            nestedSortKey: 'engagement.created_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Created',
            allowSort: true,
            getValue: (row: Engagement) => formatDate(row.created_date),
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
            key: 'status_id',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            getValue: (row: Engagement) => {
                const acceptable_status = [
                    SubmissionStatus[SubmissionStatus.Open],
                    SubmissionStatus[SubmissionStatus.Closed],
                ];
                if (row.engagement_status.status_name === EngagementStatus[EngagementStatus.Published]) {
                    if (acceptable_status.includes(SubmissionStatus[row.submission_status])) {
                        return SubmissionStatus[row.submission_status];
                    } else {
                        return (
                            EngagementStatus[EngagementStatus.Published] +
                            ' - ' +
                            SubmissionStatus[row.submission_status]
                        );
                    }
                }
                return row.engagement_status.status_name;
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
                    <MuiLink component={Link} to={`/surveys/${Number(row.surveys[0].id)}/submit`}>
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
                    <MuiLink component={Link} to={`/engagements/${Number(row.id)}/dashboard`}>
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
                            data-testid="engagement/listing/searchField"
                            variant="outlined"
                            label="Search by name"
                            name="searchText"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                        />
                        <PrimaryButton
                            data-testid="engagement/listing/searchButton"
                            onClick={() => handleSearchBarClick(searchText)}
                        >
                            <SearchIcon />
                        </PrimaryButton>
                        <SecondaryButton
                            data-testid="engagement/listing/advancedSearch"
                            name="advancedSearch"
                            onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                        >
                            {advancedSearchOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} Advanced Search
                        </SecondaryButton>
                    </Stack>
                    <PrimaryButton
                        component={Link}
                        to="/engagements/create/form"
                        data-testid="create-engagement-button-landingPage"
                    >
                        + Create Engagement
                    </PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10} style={{ width: '100%' }}>
                <Collapse in={advancedSearchOpen} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                    <AdvancedSearch setFilterParams={filterParams} />
                </Collapse>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={engagements}
                    noRowBorder={true}
                    handleChangePagination={(paginationOptions: PaginationOptions<Engagement>) =>
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

export default EngagementListing;
