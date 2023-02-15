import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetTextField } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { Link as MuiLink, Typography, Grid, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { CommentStatusChip } from '../../status';
import { CommentStatus } from 'constants/commentStatus';
import { getCommentsPage } from 'services/commentService';
import { When } from 'react-if';

const CommentTextListing = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchFilter, setSearchFilter] = useState({
        key: 'text',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
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

    const dispatch = useAppDispatch();
    const { surveyId } = useParams();

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
    }, [paginationOptions, surveyId, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const headCells: HeadCell<Comment>[] = [
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            getValue: (row: Comment) => (
                <MuiLink
                    component={Link}
                    to={`/surveys/${Number(row.survey_id)}/submissions/${row.submission_id}/review`}
                >
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'text',
            numeric: false,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (row: Comment) => row.text,
        },
        {
            key: 'status_id',
            numeric: false,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: false,
            customStyle: { width: '20%' },
            getValue: (row: Comment) => (
                <Grid container direction="column" alignItems="flex-end" justifyContent="flex-start" width="20em">
                    <Grid item sx={{ pb: '0.5em' }}>
                        <Typography variant="subtitle2" sx={{ pb: '0.5em' }}>
                            <b>Comment Date: </b>
                            {row.submission_date}
                        </Typography>
                        <When condition={row.status_id !== CommentStatus.Pending}>
                            <Typography variant="subtitle2">
                                <b>Reviewed By: </b> {row.reviewed_by}
                            </Typography>
                        </When>
                    </Grid>
                    <Grid item>
                        <CommentStatusChip commentStatus={row.status_id} />
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
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} container>
                <Grid item xs={12} lg={4}>
                    <Stack direction="row" spacing={1}>
                        <MetTextField
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
            </Grid>
            <Grid item sm={12} lg={10}>
                <MetTable
                    hideHeader={true}
                    headCells={headCells}
                    rows={comments}
                    handleChangePagination={(pagination: PaginationOptions<Comment>) => setPagination(pagination)}
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
                <PrimaryButton component={Link} to={`/surveys/${comments[0]?.survey_id || 0}/comments`}>
                    Return to Comments List
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentTextListing;
