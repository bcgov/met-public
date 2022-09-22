import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetHeader1 } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getCommentsPage } from 'services/commentService';

const CommentListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'id',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [paginationOptions, setPagination] = useState<PaginationOptions<Comment>>({
        page: 1,
        size: 10,
        sort_key: 'id',
        nested_sort_key: 'comment.id',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });
    const [tableLoading, setTableLoading] = useState(true);
    const { surveyId } = useParams();

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadComments = async () => {
        try {
            if (isNaN(Number(surveyId))) {
                dispatch(openNotification({ severity: 'error', text: 'Invalid surveyId' }));
            }

            setTableLoading(true);
            const response = await getCommentsPage({
                survey_id: Number(surveyId),
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
            });
            setComments(response.items);
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
        loadComments();
    }, [surveyId, paginationOptions, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const headCells: HeadCell<Comment>[] = [
        {
            key: 'id',
            nestedSortKey: 'comment.id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            getValue: (row: Comment) => (
                <MuiLink component={Link} to={`/surveys/${Number(row.survey_id)}/comments/${row.id}/review`}>
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'submission_date',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            getValue: (row: Comment) => formatDate(row.submission_date || ''),
        },
        {
            key: 'reviewed_by',
            numeric: true,
            disablePadding: false,
            label: 'Reviewed By',
            allowSort: true,
            getValue: (row: Comment) => row.reviewed_by,
        },

        {
            key: 'review_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Reviewed',
            allowSort: true,
            getValue: (row: Comment) => formatDate(row.review_date || ''),
        },
        {
            key: 'comment_status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            getValue: (row: Comment) => row.comment_status.status_name,
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
                    <strong>{`${comments[0]?.survey || ''} Comments`}</strong>
                </MetHeader1>
                <MetTable
                    headCells={headCells}
                    rows={comments}
                    noRowBorder={true}
                    handleChangePagination={(pagination: PaginationOptions<Comment>) => setPagination(pagination)}
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
                <PrimaryButton component={Link} to={`/surveys/${comments[0]?.survey_id || 0}/comments/all`}>
                    Read All Comments
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentListing;
