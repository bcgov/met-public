import React, { useContext, useState } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { MetPageGridContainer, MetTooltip, PrimaryButton, SecondaryButton } from 'components/common';
import { Survey } from 'models/survey';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Collapse, Link as MuiLink, Theme, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useAppSelector } from 'hooks';
import { SubmissionStatus } from 'constants/engagementStatus';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { ApprovedIcon, NewIcon, NFRIcon, RejectedIcon } from 'components/engagement/listing/Icons';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FiberNewOutlined from '@mui/icons-material/FiberNewOutlined';
import { PermissionsGate } from 'components/permissionsGate';
import { CommentStatus } from 'constants/commentStatus';
import { ActionsDropDown } from './ActionsDropDown';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import LinkIcon from '@mui/icons-material/Link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Palette } from 'styles/Theme';
import { AdvancedSearch } from './AdvancedSearch';
import { SurveyListingContext } from './SurveyListingContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { USER_ROLES } from 'services/userService/constants';

const Surveys = () => {
    const {
        paginationOptions,
        setPaginationOptions,
        setSearchFilter,
        pageInfo,
        tableLoading,
        surveys,
        searchText,
        setSearchText,
        searchFilter,
    } = useContext(SurveyListingContext);
    const navigate = useNavigate();

    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const canViewPrivateEngagements = roles.includes(USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS);

    const canViewAllCommentStatus = roles.includes(USER_ROLES.SHOW_ALL_COMMENT_STATUS);

    const submissionHasBeenOpened = (survey: Survey) => {
        return (
            !!survey.engagement &&
            [SubmissionStatus.Open, SubmissionStatus.Closed].includes(survey.engagement.submission_status)
        );
    };

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
            renderCell: (row: Survey) => (
                <MuiLink component={Link} to={`/surveys/${Number(row.id)}/submit`}>
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
            renderCell: (row: Survey) => formatDate(row.created_date),
        },
        {
            key: 'engagement',
            nestedSortKey: 'engagement.published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            renderCell: (row: Survey) => formatDate(row.engagement?.published_date ?? ''),
        },
        {
            key: 'engagement',
            nestedSortKey: 'engagement.status_id',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: true,
            renderCell: (row: Survey) => {
                if (row.is_hidden) {
                    return (
                        <MetTooltip
                            title={
                                <>
                                    <strong>Hidden</strong>
                                    <p>
                                        This survey is only visible to Administrators. Disable this setting to have it
                                        visible to team members and viewers.
                                    </p>
                                </>
                            }
                            placement="right"
                            arrow
                        >
                            <VisibilityOffIcon />
                        </MetTooltip>
                    );
                }

                if (row.is_template) {
                    return (
                        <MetTooltip
                            title={
                                <>
                                    <strong>Template</strong>
                                    <p>Templates can be cloned and then edited.</p>
                                </>
                            }
                            placement="right"
                            arrow
                        >
                            <DashboardIcon />
                        </MetTooltip>
                    );
                }

                if (row.engagement_id) {
                    return (
                        <MetTooltip
                            title={
                                <>
                                    <strong>Linked</strong>
                                    <p>
                                        This survey is attached to an engagement. It can still be cloned and then
                                        edited.
                                    </p>
                                </>
                            }
                            placement="right"
                            arrow
                        >
                            <LinkIcon />
                        </MetTooltip>
                    );
                }

                return (
                    <MetTooltip
                        title={
                            <>
                                <strong>Ready</strong>
                                <p>This survey is ready to be cloned or attached to an engagement.</p>
                            </>
                        }
                        placement="right"
                        arrow
                    >
                        <CheckIcon sx={{ stroke: Palette.icons.surveyReady, strokeWidth: '2' }} />
                    </MetTooltip>
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
            renderCell: (row: Survey) => {
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
            renderCell: (row: Survey) => {
                if (!submissionHasBeenOpened(row)) {
                    return <></>;
                }
                const { approved } = row.comments_meta_data;
                return (
                    <MetTooltip title={'Approved'} disableInteractive placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
            renderCell: (row: Survey) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.engagement_id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { needs_further_review } = row.comments_meta_data;
                return (
                    <MetTooltip disableInteractive title={'Need further review'} placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
            renderCell: (row: Survey) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.engagement_id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { rejected } = row.comments_meta_data;
                return (
                    <MetTooltip disableInteractive title={'Rejected'} placement="right" arrow>
                        <span>
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
                        </span>
                    </MetTooltip>
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
            renderCell: (row: Survey) => {
                if (
                    !submissionHasBeenOpened(row) ||
                    (!canViewPrivateEngagements && !assignedEngagements.includes(Number(row.engagement_id))) ||
                    !canViewAllCommentStatus
                ) {
                    return <></>;
                }
                const { pending } = row.comments_meta_data;
                return (
                    <MetTooltip disableInteractive title={'New comments'} placement="right" arrow>
                        <span>
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
            renderCell: (row: Survey) => {
                return <ActionsDropDown survey={row} />;
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
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                        <Stack direction="row" spacing={1} width={{ xs: '100%', md: 'auto' }}>
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
                        <SecondaryButton
                            data-testid="survey-listing/advanced-search-button"
                            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                            startIcon={
                                <ExpandMoreIcon
                                    sx={{
                                        transition: (theme) =>
                                            theme.transitions.create('transform', {
                                                duration: theme.transitions.duration.shortest,
                                            }),
                                        transform: isAdvancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            }
                            fullWidth={isMediumScreen ? true : false}
                        >
                            Advanced Search
                        </SecondaryButton>
                    </Stack>
                    <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                        <PrimaryButton component={Link} to="/surveys/create">
                            + Create Survey
                        </PrimaryButton>
                    </PermissionsGate>
                </Stack>
            </Grid>

            <Grid item xs={12}>
                <Collapse in={isAdvancedSearchOpen}>
                    <AdvancedSearch />
                </Collapse>
            </Grid>

            <Grid item xs={12}>
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

export default Surveys;
