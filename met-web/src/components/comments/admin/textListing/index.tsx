import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
    MetPageGridContainer,
    PrimaryButton,
    MetParagraph,
    MetLabel,
    MetTooltip,
    SecondaryButton,
} from 'components/common';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { Link as MuiLink, Grid, Stack, TextField, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { CommentStatusChip } from '../../status';
import { CommentStatus } from 'constants/commentStatus';
import { If, Then, Else, When } from 'react-if';
import { getSubmissionPage } from 'services/submissionService';
import { SurveySubmission } from 'models/surveySubmission';
import { formatDate, formatToUTC } from 'components/common/dateHelper';
import { USER_ROLES } from 'services/userService/constants';
import { USER_COMPOSITE_ROLE } from 'models/user';
import { updateURLWithPagination } from 'components/common/Table/utils';
import CommentIcon from '@mui/icons-material/Comment';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getStaffCommentSheet, getProponentCommentSheet } from 'services/commentService';
import { downloadFile } from 'utils';
import { getSurvey } from 'services/surveyService';
import { Survey, createDefaultSurvey } from 'models/survey';
import { PermissionsGate } from 'components/permissionsGate';
import { HTTP_STATUS_CODES } from 'constants/httpResponseCodes';
import axios from 'axios';

const CommentTextListing = () => {
    const { roles, userDetail, assignedEngagements } = useAppSelector((state) => state.user);
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const pageFromURL = searchParams.get('page');
    const sizeFromURL = searchParams.get('size');
    const badgeStyle: React.CSSProperties = {
        padding: 0,
        margin: 0,
        width: '25%',
    };
    const [searchFilter, setSearchFilter] = useState({
        key: 'text',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [paginationOptions, setPagination] = useState<PaginationOptions<SurveySubmission>>({
        page: Number(pageFromURL) || 1,
        size: Number(sizeFromURL) || 10,
        sort_key: 'id',
        nested_sort_key: 'submission.id',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });
    const [tableLoading, setTableLoading] = useState(true);

    const dispatch = useAppDispatch();
    const { surveyId } = useParams();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportToCSVOpen, setExportToCSVOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [survey, setSurvey] = useState<Survey>(createDefaultSurvey());

    const handleExportStaffComments = async () => {
        try {
            setIsExporting(true);
            const response = await getStaffCommentSheet({ survey_id: survey.id });
            downloadFile(response, `INTERNAL ONLY - ${survey.engagement?.name || ''} - ${formatToUTC(Date())}.csv`);
            setIsExporting(false);
            handleExportToCSVClose(); // Close the menu after export
        } catch (error) {
            setIsExporting(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while exporting comments. Please try again later.',
                }),
            );
        }
    };

    const handleExportProponentComments = async () => {
        try {
            setIsExporting(true);
            const response = await getProponentCommentSheet({ survey_id: survey.id });
            downloadFile(response, `PUBLIC - ${survey.engagement?.name || ''} - ${formatToUTC(Date())}.xlsx`);
            setIsExporting(false);
            handleExportToCSVClose(); // Close the menu after export
        } catch (error) {
            setIsExporting(false);
            if (axios.isAxiosError(error) && error.response?.status === HTTP_STATUS_CODES.FORBIDDEN) {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'You do not have permission to export this data.',
                    }),
                );
            } else {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Error occurred while exporting comments. Please try again later.',
                    }),
                );
            }
        }
    };

    const handleExportToCSVOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setExportToCSVOpen(!exportToCSVOpen);
    };

    const handleExportToCSVClose = () => {
        setAnchorEl(null);
        setExportToCSVOpen(false);
    };

    const customStyle = {
        minWidth: '180px',
        width: '100%',
    };

    const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
    const loadSubmissions = async () => {
        try {
            setTableLoading(true);
            const queryParams = {
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
            };
            const response = await getSubmissionPage({
                survey_id: Number(surveyId),
                queryParams,
            });
            setSubmissions(response.items);
            setPageInfo({
                total: response.total,
            });
            const survey = await getSurvey(Number(surveyId));
            setSurvey(survey);
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching submissions' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
        updateURLWithPagination(paginationOptions);
    }, [paginationOptions, surveyId, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const headCells: HeadCell<SurveySubmission>[] = [
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            renderCell: (row) => {
                if (
                    roles.includes(USER_ROLES.REVIEW_COMMENTS) ||
                    (assignedEngagements.includes(Number(row.engagement_id)) &&
                        userDetail.composite_roles?.includes('/' + USER_COMPOSITE_ROLE.TEAM_MEMBER.value))
                ) {
                    return (
                        <MuiLink component={Link} to={`/surveys/${Number(row.survey_id)}/submissions/${row.id}/review`}>
                            {row.id}
                        </MuiLink>
                    );
                }
                return row.id;
            },
        },
        {
            key: 'comments',
            numeric: true,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            renderCell: (row: SurveySubmission) => (
                <Grid container xs={12} rowSpacing={2} sx={{ pt: 1.5 }}>
                    {row.comments?.map((comment, index) => {
                        return (
                            <Grid key={index} item xs={12}>
                                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                                    <Grid item xs={1} paddingTop={1}>
                                        <If condition={comment.is_displayed}>
                                            <Then>
                                                <Grid xs={12} item>
                                                    <MetTooltip
                                                        disableInteractive
                                                        title={'Displayed to the public'}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <span>
                                                            <CommentIcon color="info" />
                                                        </span>
                                                    </MetTooltip>
                                                </Grid>
                                            </Then>
                                            <Else>
                                                <Grid xs={12} item>
                                                    <MetTooltip
                                                        disableInteractive
                                                        title={'Not displayed to the public'}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <span>
                                                            <CommentsDisabledIcon color="info" />
                                                        </span>
                                                    </MetTooltip>
                                                </Grid>
                                            </Else>
                                        </If>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <MetLabel>{comment.label ?? 'Label not available.'} </MetLabel>
                                        <MetParagraph>{' ' + comment.text}</MetParagraph>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            ),
        },
        {
            key: 'comment_status_id',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            align: 'right',
            customStyle: badgeStyle,
            renderCell: (row: SurveySubmission) => (
                <Grid container>
                    <Grid
                        container
                        item
                        sx={{
                            pb: '0.1em',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Grid
                            xs={12}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Stack
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <MetParagraph
                                    sx={{
                                        pb: '0.1em',
                                    }}
                                >
                                    <b>Comment Date: </b>
                                </MetParagraph>
                                <MetParagraph>{formatDate(row.created_date)}</MetParagraph>
                            </Stack>
                        </Grid>
                        <When condition={row.comment_status_id !== CommentStatus.Pending}>
                            <Grid
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Stack
                                    sx={{
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <MetParagraph
                                        sx={{
                                            pb: '0.1em',
                                        }}
                                    >
                                        <b>Reviewed By: </b>
                                    </MetParagraph>
                                    <MetParagraph>{row.reviewed_by}</MetParagraph>
                                </Stack>
                            </Grid>
                        </When>
                    </Grid>
                    <Grid item container xs={12} alignItems={'flex-start'} justifyContent={'flex-start'}>
                        <CommentStatusChip commentStatus={row.comment_status_id} />
                    </Grid>
                </Grid>
            ),
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            rowSpacing={1}
        >
            <Grid item xs={12} lg={7}>
                <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="flex-start">
                    <TextField
                        id="comments"
                        variant="outlined"
                        label="Search Comments"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="small"
                    />
                    <PrimaryButton
                        data-testid="CommentListing/search-button"
                        variant="contained"
                        onClick={() => handleSearchBarClick(searchText)}
                    >
                        <SearchIcon />
                    </PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <PrimaryButton component={Link} to={`/surveys/${submissions[0]?.survey_id || 0}/comments`}>
                        Return to Comments List
                    </PrimaryButton>
                    <PermissionsGate
                        scopes={[USER_ROLES.EXPORT_INTERNAL_COMMENT_SHEET, USER_ROLES.EXPORT_PROPONENT_COMMENT_SHEET]}
                        errorProps={{ disabled: true }}
                    >
                        <SecondaryButton
                            variant="contained"
                            onClick={handleExportToCSVOpen}
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            loading={isExporting}
                            startIcon={
                                <ExpandMoreIcon
                                    style={{
                                        transition: 'transform 0.3s',
                                        transform: exportToCSVOpen ? 'rotate(180deg)' : 'none',
                                    }}
                                />
                            }
                        >
                            Export to CSV
                        </SecondaryButton>
                    </PermissionsGate>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleExportToCSVClose}
                    >
                        <MenuItem onClick={handleExportProponentComments} style={customStyle}>
                            Public/Proponent
                        </MenuItem>
                        <PermissionsGate scopes={[USER_ROLES.EXPORT_INTERNAL_COMMENT_SHEET]}>
                            <MenuItem onClick={handleExportStaffComments} style={customStyle}>
                                Internal Only/Detailed
                            </MenuItem>
                        </PermissionsGate>
                    </Menu>
                </Stack>
            </Grid>
            <Grid item lg={12}>
                <MetTable
                    hideHeader={true}
                    headCells={headCells}
                    rows={submissions}
                    handleChangePagination={(pagination: PaginationOptions<SurveySubmission>) =>
                        setPagination(pagination)
                    }
                    commentTable
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentTextListing;
