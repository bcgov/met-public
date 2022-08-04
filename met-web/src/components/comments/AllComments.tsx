import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { Link as MuiLink, Typography, Button, Grid, Chip } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { fetchComments } from 'services/commentService';

const AllComments = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    const dispatch = useAppDispatch();
    const { surveyId } = useParams();
    const navigate = useNavigate();

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
            getValue: (row: Comment) => (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '16px' }}>
                            <b>Comment Date: </b>
                            {row.submission_date}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '16px' }}>
                            <b>Reviewed By: </b> {row.reviewed_by}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={8}>
                        {row.comment_status.status_name != 'Approved' ? (
                            <Chip label="Approved" color="success" />
                        ) : (
                            <Chip label="Rejected" color="error" />
                        )}
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
            <Grid item xs={12} lg={10}>
                <MetTable hideHeader={true} headCells={headCells} rows={comments} defaultSort={'id'} />
                <Button variant="contained" onClick={() => navigate(`/survey/${surveyId}/comments`)}>
                    Return to Comments List
                </Button>
            </Grid>
        </MetPageGridContainer>
    );
};

export default AllComments;
