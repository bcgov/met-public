import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetHeader1, SecondaryButton } from 'components/common';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate, formatToUTC } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSubmissionPage } from 'services/submissionService';
import { SurveySubmission } from 'models/surveySubmission';
import { createDefaultSurvey, Survey } from 'models/survey';
import { getSurvey } from 'services/surveyService';
import { CommentStatus } from 'constants/commentStatus';
import { getCommentsSheet } from 'services/commentService';
import { downloadFile } from 'utils';

const SubmissionListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'id',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [survey, setSurvey] = useState<Survey>(createDefaultSurvey());
    const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
    const [paginationOptions, setPagination] = useState<PaginationOptions<SurveySubmission>>({
        page: 1,
        size: 10,
        sort_key: 'id',
        nested_sort_key: 'submission.id',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });
    const [tableLoading, setTableLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const { surveyId } = useParams();

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadSurvey = async () => {
        try {
            const survey = await getSurvey(Number(surveyId));
            setSurvey(survey);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching survey information' }));
            setTableLoading(false);
        }
    };

    const loadSubmissions = async () => {
        try {
            setTableLoading(true);
            const response = await getSubmissionPage({
                survey_id: Number(surveyId),
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
            });
            setSubmissions(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching submissions' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        if (isNaN(Number(surveyId))) {
            dispatch(openNotification({ severity: 'error', text: 'Invalid surveyId' }));
            return;
        }

        loadSurvey();
        loadSubmissions();
    }, [surveyId, paginationOptions, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const handleExportComments = async () => {
        setIsExporting(true);
        const response = await getCommentsSheet({ survey_id: survey.id });
        downloadFile(response, `${survey.engagement?.name || ''} - ${formatToUTC(Date())}.csv`);
        setIsExporting(false);
    };

    const headCells: HeadCell<SurveySubmission>[] = [
        {
            key: 'id',
            nestedSortKey: 'submission.id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            getValue: (row) => (
                <MuiLink component={Link} to={`/surveys/${Number(row.survey_id)}/submissions/${row.id}/review`}>
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            getValue: (row) => formatDate(row.created_date || ''),
        },
        {
            key: 'reviewed_by',
            numeric: true,
            disablePadding: false,
            label: 'Reviewed By',
            allowSort: true,
            getValue: (row) => row.reviewed_by,
        },

        {
            key: 'review_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Reviewed',
            allowSort: true,
            getValue: (row) => formatDate(row.review_date || ''),
        },
        {
            key: 'comment_status_id',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            getValue: (row) =>
                CommentStatus[
                    row.comment_status_id === CommentStatus.NeedsFurtherReview
                        ? CommentStatus.Pending
                        : row.comment_status_id
                ],
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
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
                        onClick={() => handleSearchBarClick(searchText)}
                    >
                        <SearchIcon />
                    </PrimaryButton>
                </Stack>
                <SecondaryButton onClick={handleExportComments} loading={isExporting}>
                    Export to CSV
                </SecondaryButton>
            </Stack>

            <Grid item xs={12}>
                <MetHeader1>
                    <strong>{`${survey.name} Comments`}</strong>
                </MetHeader1>
                <MetTable
                    headCells={headCells}
                    rows={submissions}
                    noRowBorder={false}
                    handleChangePagination={(pagination: PaginationOptions<SurveySubmission>) =>
                        setPagination(pagination)
                    }
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
                <PrimaryButton component={Link} to={`/surveys/${survey.id}/comments/all`}>
                    Read All Comments
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SubmissionListing;
