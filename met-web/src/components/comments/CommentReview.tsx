import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, FormControl, RadioGroup, FormControlLabel, Radio, Toolbar } from '@mui/material';
import { Comment, createDefaultComment } from 'models/comment';
import { getComment } from 'services/commentService';
const headerStyle = { fontWeight: 'bold' };
import { useAppDispatch } from 'hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
const comment: Comment = {
    id: 1,
    survey_id: 1,
    submission_date: 'test',
    published_date: 'test',
    status_id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum hasbeen the industry's standard dummy text ever since the 1500s, when an unknown printer took agalley of type and scrambled it to make a type specimen book. It has survived not only fivecenturies, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum",
    reviewed_by: 'test',
    review_date: 'test',
    comment_status: { id: 0, status_name: 'Approved' },
    survey: 'hello',
};

const CommentReview = () => {
    const [comment, setComments] = useState<Comment>(createDefaultComment());

    const dispatch = useAppDispatch();
    const { surveyId, commentId } = useParams();
    const navigate = useNavigate();

    const callGetComment = async () => {
        try {
            if (isNaN(Number(surveyId))) {
                dispatch(openNotification({ severity: 'error', text: 'Invalid commentId' }));
            }

            const fetchedComment = await getComment(Number(commentId));
            setComments(fetchedComment);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comment' }));
        }
    };

    useEffect(() => {
        callGetComment();
    }, []);

    return (
        <>
            <Toolbar />
            <Grid sx={{ pl: 5 }} container spacing={6}>
                <Grid container item spacing={3}>
                    <Grid sx={{ ...headerStyle }} container item xs={6}>
                        <Grid item xs={2}>
                            <Typography sx={headerStyle}>Comment ID:</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography>{comment.id}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6}>
                        <Typography sx={headerStyle}>Status:</Typography>
                        <Typography sx={{ pl: 2 }}>{comment.comment_status.status_name}</Typography>
                    </Grid>

                    <Grid sx={headerStyle} container item xs={6}>
                        <Grid item xs={2}>
                            <Typography sx={headerStyle}>Reviewed by:</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography>{comment.reviewed_by}</Typography>
                        </Grid>
                    </Grid>
                    <Grid sx={headerStyle} container item xs={6}>
                        <Typography sx={headerStyle}>Comment Date:</Typography>
                        <Typography sx={{ pl: 2 }}>{comment.submission_date}</Typography>
                    </Grid>
                    <Grid sx={headerStyle} container item xs={12}>
                        <Grid item container xs={3}>
                            <Typography sx={headerStyle}>Date Reviewed:</Typography>
                            <Typography sx={{ pl: 2 }}>{comment.review_date}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item spacing={2}>
                    <Grid xs={12} item>
                        <Typography sx={headerStyle}>Comment</Typography>
                    </Grid>
                    <Grid xs={8} item>
                        <Typography>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </Typography>
                        <Grid />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item>
                        <Typography sx={headerStyle}>Comment Approval</Typography>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="radio-buttons"
                                defaultValue="approved"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                                <FormControlLabel value="rejected" control={<Radio />} label="Reject" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item spacing={2}>
                    <Grid item>
                        <Button variant="contained" onClick={() => navigate('/')}>
                            Save
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default CommentReview;
