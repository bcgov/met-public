import React, { useState, useEffect } from 'react';
import { When } from 'react-if';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { Link, useNavigate } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import { Engagement } from 'models/engagement';
import { useAppDispatch, useAppSelector } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink, useMediaQuery, Theme } from '@mui/material';
import { getEngagements } from 'services/engagementService';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';
import AdvancedSearch from './AdvancedSearch/SearchComponent';
import AdvancedSearchMobile from './AdvancedSearch/SearchComponentMobile';
import { SearchOptions } from './AdvancedSearch/SearchTypes';
import { PermissionsGate } from 'components/permissionsGate';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { ApprovedIcon, NewIcon, NFRIcon, RejectedIcon } from './Icons';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FiberNewOutlined from '@mui/icons-material/FiberNewOutlined';
import { CommentStatus } from 'constants/commentStatus';
import { ActionsDropDown } from './ActionsDropDown';

const EngagementListing = () => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();

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
        project_name: '',
        project_id: '',
        application_number: '',
        client_name: '',
        project_type: '',
        created_from_date: '',
        created_to_date: '',
        published_from_date: '',
        published_to_date: '',
    });

    const dispatch = useAppDispatch();

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const canViewPrivateEngagements = roles.includes(SCOPES.viewPrivateEngagements);

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
                project_type: searchOptions.project_type,
                project_id: searchOptions.project_id,
                project_name: searchOptions.project_name,
                client_name: searchOptions.client_name,
                application_number: searchOptions.application_number,
            });
            setEngagements(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
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
            renderCell: (row: Engagement) => (
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
            renderCell: (row: Engagement) => formatDate(row.created_date),
        },
        {
            key: 'published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            renderCell: (row: Engagement) => {
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
            renderCell: (row: Engagement) => {
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
            numeric: true,
            disablePadding: false,
            label: 'Comments',
            customStyle: { padding: 2 },
            align: 'left',
            hideSorticon: true,
            allowSort: false,
            renderCell: (row: Engagement) => {
                const isAuthorized = canViewPrivateEngagements || assignedEngagements.includes(Number(row.id));

                if (row.surveys.length === 0 || !isAuthorized) {
                    return '';
                }
                return (
                    <MuiLink component={Link} to={`/surveys/${row.surveys[0].id}/comments`}>
                        View All
                    </MuiLink>
                );
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: '',
            customStyle: { padding: 2 },
            hideSorticon: true,
            align: 'left',
            icon: (
                <ApprovedIcon>
                    <CheckIcon fontSize="small" />
                </ApprovedIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                const { approved } = row.submissions_meta_data;
                return (
                    <ApprovedIcon
                        onClick={() => {
                            if (row.surveys.length === 0) return;
                            navigate(`/surveys/${row.surveys[0].id}/comments`, {
                                state: {
                                    status: CommentStatus.Approved,
                                },
                            });
                        }}
                    >
                        {approved || 0}
                    </ApprovedIcon>
                );
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: '',

            customStyle: { padding: 2 },
            hideSorticon: true,
            align: 'left',
            icon: (
                <NFRIcon>
                    <PriorityHighRoundedIcon fontSize="small" />
                </NFRIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { needs_further_review } = row.submissions_meta_data;
                return (
                    <NFRIcon
                        onClick={() => {
                            if (row.surveys.length === 0) return;
                            navigate(`/surveys/${row.surveys[0].id}/comments`, {
                                state: {
                                    status: CommentStatus.NeedsFurtherReview,
                                },
                            });
                        }}
                    >
                        {needs_further_review || 0}
                    </NFRIcon>
                );
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: '',

            customStyle: { padding: 2 },
            hideSorticon: true,
            align: 'left',
            icon: (
                <RejectedIcon>
                    <CloseRounded fontSize="small" />
                </RejectedIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { rejected } = row.submissions_meta_data;
                return (
                    <RejectedIcon
                        onClick={() => {
                            if (row.surveys.length === 0) return;
                            navigate(`/surveys/${row.surveys[0].id}/comments`, {
                                state: {
                                    status: CommentStatus.Rejected,
                                },
                            });
                        }}
                    >
                        {rejected || 0}
                    </RejectedIcon>
                );
            },
        },
        {
            key: 'surveys',
            numeric: true,
            disablePadding: false,
            label: '',

            customStyle: { padding: 2 },
            hideSorticon: true,
            align: 'left',
            icon: (
                <NewIcon>
                    <FiberNewOutlined fontSize="small" />
                </NewIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { pending } = row.submissions_meta_data;
                return (
                    <NewIcon
                        onClick={() => {
                            if (row.surveys.length === 0) return;
                            navigate(`/surveys/${row.surveys[0].id}/comments`, {
                                state: {
                                    status: CommentStatus.Pending,
                                },
                            });
                        }}
                    >
                        {pending || 0}
                    </NewIcon>
                );
            },
        },
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
            allowSort: false,
            renderCell: (row: Engagement) => {
                return <ActionsDropDown engagement={row} />;
            },
            customStyle: {
                minWidth: '200px',
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
            <Grid item xs={12}>
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
                        <When condition={!isMediumScreen}>
                            <SecondaryButton
                                data-testid="engagement/listing/advancedSearch"
                                name="advancedSearch"
                                onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                                startIcon={
                                    <ExpandMoreIcon
                                        sx={{
                                            transition: (theme) =>
                                                theme.transitions.create('transform', {
                                                    duration: theme.transitions.duration.shortest,
                                                }),
                                            transform: advancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    />
                                }
                            >
                                Advanced Search
                            </SecondaryButton>
                        </When>
                    </Stack>
                    <When condition={isMediumScreen}>
                        <SecondaryButton
                            data-testid="engagement/listing/advancedSearch"
                            name="advancedSearch"
                            onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                        >
                            {
                                <ExpandMoreIcon
                                    sx={[
                                        {
                                            transform: 'rotate(0deg)',
                                            transition: (theme) =>
                                                theme.transitions.create('all', {
                                                    duration: theme.transitions.duration.shortest,
                                                }),
                                        },
                                        advancedSearchOpen && {
                                            transform: 'rotate(180deg)',
                                        },
                                    ]}
                                />
                            }
                            Advanced Search
                        </SecondaryButton>
                    </When>
                    <PermissionsGate scopes={[SCOPES.createEngagement]} errorProps={{ disabled: true }}>
                        <PrimaryButton
                            component={Link}
                            to="/engagements/create/form"
                            data-testid="create-engagement-button-landingPage"
                        >
                            + Create Engagement
                        </PrimaryButton>
                    </PermissionsGate>
                </Stack>
            </Grid>
            <Grid item xs={12} style={{ width: '100%' }}>
                <Collapse in={advancedSearchOpen} timeout="auto" style={{ width: '100%' }}>
                    {isMediumScreen ? (
                        <AdvancedSearchMobile setFilterParams={setSearchOptions} />
                    ) : (
                        <AdvancedSearch setFilterParams={setSearchOptions} />
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <MetTable
                    headCells={headCells}
                    rows={engagements}
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
