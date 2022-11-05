import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetHeader1 } from 'components/common';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSubmissionsPage } from 'services/submissionService';
import { SurveySubmission } from 'models/surveySubmission';

const CommentListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'id',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
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
    const { surveyId } = useParams();

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadSubmissions = async () => {
        try {
            if (isNaN(Number(surveyId))) {
                dispatch(openNotification({ severity: 'error', text: 'Invalid surveyId' }));
            }

            setTableLoading(true);
            const response = await getSubmissionsPage({
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
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comments' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, [surveyId, paginationOptions, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
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
            key: 'comments',
            numeric: true,
            disablePadding: false,
            label: 'Reviewed By',
            nestedSortKey: 'comment.reviewed_by',
            allowSort: true,
            getValue: (row) => row.comments[0].reviewed_by,
        },

        {
            key: 'comments',
            numeric: true,
            disablePadding: false,
            label: 'Date Reviewed',
            nestedSortKey: 'comment.review_date',
            allowSort: true,
            getValue: (row) => row.comments[0].review_date,
        },
        {
            key: 'comments',
            numeric: false,
            disablePadding: true,
            nestedSortKey: 'comment_status.status_name',
            label: 'Status',
            allowSort: true,
            getValue: (row) => row.comments[0].comment_status.status_name,
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
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={0} md={4} lg={4}></Grid>

            <Grid item xs={12}>
                <MetHeader1>
                    <strong>{`${submissions[0]?.survey?.name || ''} Comments`}</strong>
                </MetHeader1>
                <MetTable
                    headCells={headCells}
                    rows={submissions}
                    noRowBorder={true}
                    handleChangePagination={(pagination: PaginationOptions<SurveySubmission>) =>
                        setPagination(pagination)
                    }
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
                <PrimaryButton component={Link} to={`/surveys/${submissions[0]?.survey_id || 0}/comments/all`}>
                    Read All Comments
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentListing;
