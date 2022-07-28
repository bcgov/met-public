import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { fetchComments } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementStatus } from 'constants/engagementStatus';

const CommentListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'email',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);

    const dispatch = useAppDispatch();

    const callFetchComments = async () => {
        try {
            const fetchedComments = await fetchComments();
            setComments(fetchedComments);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comments' }));
        }
    };

    useEffect(() => {
        callFetchComments();
    }, []);

    const handleSearchBarClick = (commentEmailFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: commentEmailFilter,
        });
    };

    const headCells: HeadCell<Comment>[] = [
        {
            key: 'comment_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Created',
            allowSort: true,
            getValue: (row: Comment) => formatDate(row.comment_date),
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
            key: 'status',
            numeric: true,
            disablePadding: false,
            label: 'Status',
            allowSort: false,
            getValue: (row: Comment) => {
                !row.status ? (
                    <></>
                ) : (
                    <MuiLink component={Link} to={`/comment/${row.id}`}>
                        {row.status}
                    </MuiLink>
                );
            },
        },
        {
            key: 'content',
            numeric: true,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (_row: Comment) => {
                row.content;
            },
        },
        {
            key: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Comment Email',
            allowSort: true,
            getValue: (row: Comment) => (
                <MuiLink component={Link} to={`/survey/build/${Number(row.id)}/comments`}>
                    {row.email}
                </MuiLink>
            ),
        },
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Reporting',
            allowSort: false,
            getValue: (row: Comment) => {
                if (!row.engagement) {
                    return <></>;
                }

                if (row.engagement.engagement_status.id === EngagementStatus.Draft) {
                    return <></>;
                }

                return (
                    <MuiLink component={Link} to={`/survey/${Number(row.id)}/comments`}>
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
            <Grid item xs={12} md={4} lg={3}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        id="engagement-name"
                        variant="outlined"
                        label="Search by name"
                        fullWidth
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
            <Grid item xs={12} md={4} lg={3} container direction="row" justifyContent={'flex-end'}>
                <Link to="/survey/create">
                    <Button variant="contained">+ Create Comment</Button>
                </Link>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable headCells={headCells} rows={surveys} defaultSort={'created_date'} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentListing;
