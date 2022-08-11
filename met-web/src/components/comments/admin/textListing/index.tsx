import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useParams } from 'react-router-dom';
import { ConditionalComponent, MetPageGridContainer, PrimaryButton } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { Link as MuiLink, Typography, Grid, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { CommentStatusChip } from '../../status';
import { fetchComments } from 'services/commentService';
import { CommentStatus } from 'constants/commentStatus';

const CommentTextListing = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchFilter, setSearchFilter] = useState({
        key: 'text',
        value: '',
    });
    const [searchText, setSearchText] = useState('');

    const dispatch = useAppDispatch();
    const { surveyId } = useParams();

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
    }, []);

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
                <MuiLink component={Link} to={`/survey/${Number(row.survey_id)}/comments/${row.id}/review`}>
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
            key: 'submission_date',
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
                        <ConditionalComponent condition={row.comment_status.id !== CommentStatus.Pending}>
                            <Typography variant="subtitle2">
                                <b>Reviewed By: </b> {row.reviewed_by}
                            </Typography>
                        </ConditionalComponent>
                    </Grid>
                    <Grid item>
                        <CommentStatusChip commentStatus={row.comment_status.id} />
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
                        <TextField
                            id="comments"
                            variant="outlined"
                            label="Search Comments"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                        />
                        <PrimaryButton
                            variant="contained"
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
                    filter={searchFilter}
                    hideHeader={true}
                    headCells={headCells}
                    rows={comments}
                    defaultSort={'id'}
                />
                <PrimaryButton
                    component={Link}
                    to={`/survey/${comments[0]?.survey_id || 0}/comments`}
                    variant="contained"
                >
                    Return to Comments List
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentTextListing;
