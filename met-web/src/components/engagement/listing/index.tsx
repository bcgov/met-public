import React, { useState, useEffect, Suspense } from 'react';
import { When } from 'react-if';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faMessageCheck } from '@fortawesome/pro-solid-svg-icons/faMessageCheck';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faCircleExclamation } from '@fortawesome/pro-regular-svg-icons/faCircleExclamation';
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';
import { faCommentsQuestionCheck } from '@fortawesome/pro-regular-svg-icons/faCommentsQuestionCheck';
import Collapse from '@mui/material/Collapse';
import { Link, useNavigate, useLocation, Await, useRouteLoaderData, useRevalidator } from 'react-router-dom';
import { MetPageGridContainer, MetTooltip, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { Engagement } from 'models/engagement';
import { useAppSelector } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink, useMediaQuery, Theme } from '@mui/material';
import Stack from '@mui/material/Stack';
import MetTable from 'components/common/Table';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';
import { SearchOptions } from './AdvancedSearch/SearchTypes';
import { PermissionsGate } from 'components/permissionsGate';
import { USER_ROLES } from 'services/userService/constants';
import { ApprovedIcon, NewIcon, NFRIcon, RejectedIcon } from './Icons';
import { CommentStatus } from 'constants/commentStatus';
import { ActionsDropDown } from './ActionsDropDown';
import AdvancedSearch from './AdvancedSearch/SearchComponent';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';

interface SearchFilter {
    key?: string;
    value?: string;
}

// Create a search, filter, and pagination string to pass values to the route.
const updateURL = (
    searchFilter: SearchFilter,
    paginationOptions: PaginationOptions<Engagement>,
    searchOptions: SearchOptions,
) => {
    const statusList: string = searchOptions.status_list.join('_').toString();
    const url = new URL(window.location.href);
    searchFilter?.value
        ? url.searchParams.set('search_text', searchFilter.value)
        : url.searchParams.delete('search_text');
    paginationOptions?.page && url.searchParams.set('page', paginationOptions.page.toString());
    paginationOptions?.size && url.searchParams.set('size', paginationOptions.size.toString());
    paginationOptions?.sort_key &&
        url.searchParams.set('sort_key', 'engagement.' + paginationOptions.sort_key.toString());
    paginationOptions?.sort_order && url.searchParams.set('sort_order', paginationOptions.sort_order);
    statusList ? url.searchParams.set('engagement_status', statusList) : url.searchParams.delete('engagement_status');
    searchOptions?.created_from_date
        ? url.searchParams.set('created_from_date', searchOptions.created_from_date)
        : url.searchParams.delete('created_from_date');
    searchOptions?.created_to_date
        ? url.searchParams.set('created_to_date', searchOptions.created_to_date)
        : url.searchParams.delete('created_to_date');
    searchOptions?.published_from_date
        ? url.searchParams.set('published_from_date', searchOptions.published_from_date)
        : url.searchParams.delete('published_from_date');
    searchOptions?.published_to_date
        ? url.searchParams.set('published_to_date', searchOptions.published_to_date)
        : url.searchParams.delete('published_to_date');
    window.history.replaceState({}, '', url.toString());
};

const EngagementListing = () => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromURL = searchParams.get('page');
    const sizeFromURL = searchParams.get('size');
    const [searchFilter, setSearchFilter] = useState<SearchFilter>({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const { engagements } = useRouteLoaderData('engagement-listing') as { engagements: Engagement[] };
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Engagement>>({
        page: Number(pageFromURL) || 1,
        size: Number(sizeFromURL) || 10,
        sort_key: 'created_date',
        nested_sort_key: 'engagement.created_date',
        sort_order: 'desc',
    });

    const [pageInfo] = useState<PageInfo>(createDefaultPageInfo());

    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        status_list: [],
        created_from_date: '',
        created_to_date: '',
        published_from_date: '',
        published_to_date: '',
    });

    const revalidator = useRevalidator();

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const canViewPrivateEngagements = roles.includes(USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS);

    const canViewAllCommentStatus = roles.includes(USER_ROLES.SHOW_ALL_COMMENT_STATUS);

    useEffect(() => {
        updateURL(searchFilter, paginationOptions, searchOptions);
        revalidator.revalidate();
    }, [paginationOptions, searchFilter, searchOptions]);

    const submissionHasBeenOpened = (engagement: Engagement) => {
        return [SubmissionStatus.Open, SubmissionStatus.Closed].includes(engagement.submission_status);
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
                <MuiLink component={Link} to={`/engagements/${Number(row.id)}/view`}>
                    {row.name}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            nestedSortKey: 'engagement.created_date',
            numeric: true,
            disablePadding: true,
            label: 'Date Created',
            allowSort: true,
            renderCell: (row: Engagement) => formatDate(row.created_date),
        },
        {
            key: 'published_date',
            numeric: true,
            disablePadding: true,
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
            customStyle: { padding: 2 },
            align: 'left',
            hideSorticon: true,
            allowSort: false,
            icon: <FontAwesomeIcon icon={faMessageCheck} style={{ fontSize: '28px' }} />,
            renderCell: (row: Engagement) => {
                return <></>;
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
                    <FontAwesomeIcon icon={faCheck} style={{ fontSize: '20px' }} />
                </ApprovedIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (!submissionHasBeenOpened(row)) {
                    return <></>;
                }

                const { approved } = row.submissions_meta_data;
                return (
                    <MetTooltip disableInteractive title={'Approved'} placement="right" arrow>
                        <span>
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
                                {approved}
                            </ApprovedIcon>
                        </span>
                    </MetTooltip>
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
                    <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: '20px' }} />
                </NFRIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { needs_further_review } = row.submissions_meta_data;
                return (
                    <MetTooltip disableInteractive title={'Need further review'} placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px' }} />
                </RejectedIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { rejected } = row.submissions_meta_data;
                return (
                    <MetTooltip disableInteractive title={'Rejected'} placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
                    <FontAwesomeIcon icon={faCommentsQuestionCheck} style={{ fontSize: '20px' }} />
                </NewIcon>
            ),
            allowSort: false,
            renderCell: (row: Engagement) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { pending } = row.submissions_meta_data;
                return (
                    <MetTooltip disableInteractive title={'New comments'} placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
            <AutoBreadcrumbs />
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
                        <PrimaryButtonOld
                            data-testid="engagement/listing/searchButton"
                            onClick={() => handleSearchBarClick(searchText)}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px' }} />
                        </PrimaryButtonOld>
                        <When condition={!isMediumScreen}>
                            <SecondaryButtonOld
                                data-testid="engagement/listing/advancedSearch"
                                name="advancedSearch"
                                onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                                startIcon={
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        style={{
                                            fontSize: '12px',
                                            transition: 'transform 0.3s ease',
                                            transform: advancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    />
                                }
                            >
                                Advanced Search
                            </SecondaryButtonOld>
                        </When>
                    </Stack>
                    <When condition={isMediumScreen}>
                        <SecondaryButtonOld
                            data-testid="engagement/listing/advancedSearch"
                            name="advancedSearch"
                            onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                        >
                            {
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    style={{
                                        fontSize: '12px',
                                        transition: 'transform 0.3s ease',
                                        transform: advancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        padding: '0px 10px',
                                    }}
                                />
                            }
                            Advanced Search
                        </SecondaryButtonOld>
                    </When>
                    <PermissionsGate scopes={[USER_ROLES.CREATE_ENGAGEMENT]} errorProps={{ disabled: true }}>
                        <PrimaryButtonOld
                            component={Link}
                            to="/engagements/create/form"
                            data-testid="create-engagement-button-landingPage"
                        >
                            + Create Engagement
                        </PrimaryButtonOld>
                    </PermissionsGate>
                </Stack>
            </Grid>
            <Grid item xs={12} style={{ width: '100%' }}>
                <Collapse in={advancedSearchOpen} timeout="auto" style={{ width: '100%' }}>
                    <AdvancedSearch setFilterParams={setSearchOptions} />
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <Suspense fallback={<span />}>
                    <Await resolve={engagements}>
                        {(responseData) => {
                            return (
                                <MetTable
                                    headCells={headCells}
                                    rows={responseData.items}
                                    handleChangePagination={(paginationOptions: PaginationOptions<Engagement>) =>
                                        setPaginationOptions(paginationOptions)
                                    }
                                    paginationOptions={paginationOptions}
                                    // loading={tableLoading}
                                    pageInfo={{ ...pageInfo, total: responseData.total }}
                                />
                            );
                        }}
                    </Await>
                </Suspense>
            </Grid>
        </MetPageGridContainer>
    );
};

export default EngagementListing;
