import React, { useContext, useState } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { MetPageGridContainer, MetTooltip, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { Survey } from 'models/survey';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Collapse, Link as MuiLink, Theme, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faCircleExclamation } from '@fortawesome/pro-regular-svg-icons/faCircleExclamation';
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';
import { faCommentsQuestionCheck } from '@fortawesome/pro-regular-svg-icons/faCommentsQuestionCheck';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { faCheck as regularCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faCheck as solidCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faLinkSimple } from '@fortawesome/pro-regular-svg-icons/faLinkSimple';
import { faObjectsColumn } from '@fortawesome/pro-solid-svg-icons/faObjectsColumn';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import Stack from '@mui/material/Stack';
import { useAppSelector } from 'hooks';
import { SubmissionStatus } from 'constants/engagementStatus';
import { ApprovedIcon, NewIcon, NFRIcon, RejectedIcon } from 'components/engagement/listing/Icons';
import { PermissionsGate } from 'components/permissionsGate';
import { CommentStatus } from 'constants/commentStatus';
import { ActionsDropDown } from './ActionsDropDown';
import { Palette } from 'styles/Theme';
import { AdvancedSearch } from './AdvancedSearch';
import { SurveyListingContext } from './SurveyListingContext';
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
                            <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: '20px' }} />
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
                            <FontAwesomeIcon icon={faObjectsColumn} style={{ fontSize: '22px' }} />
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
                            <FontAwesomeIcon icon={faLinkSimple} style={{ fontSize: '20px' }} />
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
                        <FontAwesomeIcon
                            icon={solidCheck}
                            style={{ fontSize: '20px', color: Palette.icons.surveyReady }}
                        />
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
                    <FontAwesomeIcon icon={regularCheck} style={{ fontSize: '20px' }} />
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
                    <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: '20px' }} />
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
                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px' }} />
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
                    <FontAwesomeIcon icon={faCommentsQuestionCheck} style={{ fontSize: '20px' }} />
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
                            <PrimaryButtonOld
                                data-testid="survey/listing/search-button"
                                onClick={() => handleSearchBarClick(searchText)}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px' }} />
                            </PrimaryButtonOld>
                        </Stack>
                        <SecondaryButtonOld
                            data-testid="survey-listing/advanced-search-button"
                            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                            startIcon={
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    style={{
                                        fontSize: '12px',
                                        transition: 'transform 0.3s ease',
                                        transform: isAdvancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            }
                            fullWidth={isMediumScreen ? true : false}
                        >
                            Advanced Search
                        </SecondaryButtonOld>
                    </Stack>
                    <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                        <PrimaryButtonOld component={Link} to="/surveys/create">
                            + Create Survey
                        </PrimaryButtonOld>
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
