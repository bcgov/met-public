import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Survey } from 'models/survey';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { getSurveysPage } from 'services/surveyService';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { ApprovedIcon, NewIcon, NFRIcon, RejectedIcon } from 'components/engagement/listing/Icons';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FiberNewOutlined from '@mui/icons-material/FiberNewOutlined';
import { PermissionsGate } from 'components/permissionsGate';
import { CommentStatus } from 'constants/commentStatus';

const SurveyListing = () => {
    const navigate = useNavigate();
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Survey>>({
        page: 1,
        size: 10,
        sort_key: 'created_date',
        nested_sort_key: 'survey.created_date',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());

    const [tableLoading, setTableLoading] = useState(true);

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const canViewPrivateEngagements = roles.includes(SCOPES.viewPrivateEngagements);

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
                <MuiLink component={Link} to={`/surveys/${Number(row.id)}/build`}>
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
            nestedSortKey: 'engagement.status_id',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            getValue: (row: Survey) => {
                const acceptable_status = [
                    SubmissionStatus[SubmissionStatus.Open],
                    SubmissionStatus[SubmissionStatus.Closed],
                ];
                if (
                    row.engagement &&
                    row.engagement.engagement_status.status_name === EngagementStatus[EngagementStatus.Published]
                ) {
                    if (acceptable_status.includes(SubmissionStatus[row.engagement.submission_status])) {
                        return SubmissionStatus[row.engagement.submission_status];
                    } else {
                        return (
                            EngagementStatus[EngagementStatus.Published].toString() +
                            ' - ' +
                            SubmissionStatus[row.engagement.submission_status]
                        );
                    }
                }
                return (
                    row.engagement?.engagement_status.status_name || EngagementStatus[EngagementStatus.Draft].toString()
                );
            },
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
                    <MuiLink component={Link} to={`/engagements/${row.engagement.id}/view`}>
                        {row.engagement.name}
                    </MuiLink>
                );
            },
        },
        {
            key: 'comments_meta_data',
            numeric: true,
            disablePadding: false,
            label: 'Comments',
            customStyle: { padding: 2 },
            align: 'left',
            hideSorticon: true,
            allowSort: false,
            getValue: (row: Survey) => {
                const isAuthorized = canViewPrivateEngagements || assignedEngagements.includes(Number(row.id));

                if (!isAuthorized) {
                    return '';
                }
                return (
                    <MuiLink component={Link} to={`/surveys/${row.id}/comments`}>
                        View All
                    </MuiLink>
                );
            },
        },
        {
            key: 'comments_meta_data',
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
            getValue: (row: Survey) => {
                const { approved } = row.comments_meta_data;
                return (
                    <ApprovedIcon
                        onClick={() => {
                            navigate(`/surveys/${row.id}/comments`, {
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
            key: 'comments_meta_data',
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
            getValue: (row: Survey) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { needs_further_review } = row.comments_meta_data;
                return (
                    <NFRIcon
                        onClick={() => {
                            navigate(`/surveys/${row.id}/comments`, {
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
            key: 'comments_meta_data',
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
            getValue: (row: Survey) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { rejected } = row.comments_meta_data;
                return (
                    <RejectedIcon
                        onClick={() => {
                            navigate(`/surveys/${row.id}/comments`, {
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
            key: 'comments_meta_data',
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
            getValue: (row: Survey) => {
                if (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.id))) {
                    return <></>;
                }
                const { pending } = row.comments_meta_data;
                return (
                    <NewIcon
                        onClick={() => {
                            navigate(`/surveys/${row.id}/comments`, {
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
                    <MuiLink component={Link} to={`/engagements/${Number(row.engagement.id)}/dashboard`}>
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
                            name="searchText"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                        />
                        <PrimaryButton
                            data-testid="survey/listing/search-button"
                            onClick={() => handleSearchBarClick(searchText)}
                        >
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
                    <PermissionsGate scopes={[SCOPES.createSurvey]} errorProps={{ disabled: true }}>
                        <PrimaryButton component={Link} to="/surveys/create">
                            + Create Survey
                        </PrimaryButton>
                    </PermissionsGate>
                </Stack>
            </Grid>

            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={surveys}
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
