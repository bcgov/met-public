import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { Link as MuiLink, Typography, Button, Grid } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { CommentStatusChip } from '../../status';
import { fetchComments } from 'services/commentService';

const CommentTextListing = () => {
    const [comments, setComments] = useState<Comment[]>([]);

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
            key: 'text',
            numeric: true,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (row: Comment) => row.text,
        },
        {
            key: 'submission_date',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            customStyle: { width: '20%' },
            getValue: (row: Comment) => (
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    rowSpacing={1}
                    width="20em"
                >
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            <b>Comment Date: </b>
                            {row.submission_date}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            <b>Reviewed By: </b> {row.reviewed_by}
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} justifyContent="flex-end">
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
            <Grid item xs={12}>
                <MetTable hideHeader={true} headCells={headCells} rows={comments} defaultSort={'id'} />
                <Button component={Link} to={`/survey/${comments[0]?.survey_id || 0}/comments`} variant="contained">
                    Return to Comments List
                </Button>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentTextListing;
