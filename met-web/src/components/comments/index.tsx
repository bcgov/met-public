import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { fetchComments } from 'services/commentService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const CommentListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'email',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const callFetchComments = async () => {
        try {
            if (isNaN(Number(surveyId))) {
                dispatch(openNotification({ severity: 'error', text: 'Invalid surveyId' }));
            }

            const fetchedComments = await fetchComments({
                survey_id: Number(surveyId),
            });
            setComments(fetchedComments);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comments' }));
        }
    };

    useEffect(() => {
        callFetchComments();
    }, [surveyId]);

    const handleSearchBarClick = (commentEmailFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: commentEmailFilter,
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
                <MuiLink component={Link} to={`/survey/${Number(row.survey_id)}/comments/${row.id}`}>
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
            key: 'published_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Comment) => formatDate(row.published_date || ''),
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
                    <Button
                        variant="contained"
                        data-testid="CommentListing/search-button"
                        onClick={() => handleSearchBarClick(searchText)}
                    >
                        <SearchIcon />
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={0} md={4} lg={4}></Grid>

            <Grid item xs={12}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {`${comments[0]?.survey || ''} Comments`}
                </Typography>
                <MetTable headCells={headCells} rows={comments} defaultSort={'id'} />
                <Button variant="contained" onClick={() => navigate(`/survey/${surveyId}/comments/all`)}>
                    View All Comments
                </Button>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentListing;
