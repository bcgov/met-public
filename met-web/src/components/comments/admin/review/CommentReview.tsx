import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    CircularProgress,
    FormLabel,
} from '@mui/material';
import { Comment, createDefaultComment } from 'models/comment';
import { getComment, ReviewComment } from 'services/commentService';
import { useAppDispatch } from 'hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, MetLabelBody, MetPageGridContainer } from 'components/common';
import { Palette } from 'styles/Theme';
import { CommentStatus } from 'constants/commentStatus';
import { formatDate } from 'components/common/dateHelper';
import { CommentReviewSkeleton } from './CommentReviewSkeleton';

const CommentReview = () => {
    const [comment, setComment] = useState<Comment>(createDefaultComment());
    const [review, setReview] = useState(CommentStatus.Accepted);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { commentId } = useParams();

    const callGetComment = async () => {
        try {
            if (isNaN(Number(commentId))) {
                throw new Error();
            }

            const fetchedComment = await getComment(Number(commentId));
            setComment(fetchedComment);
            setIsLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comment' }));
            navigate('/');
        }
    };

    useEffect(() => {
        callGetComment();
    }, [commentId]);

    const handleReviewChange = (verdict: number) => {
        setReview(verdict);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await ReviewComment({ comment_id: Number(commentId), status_id: review });
            setIsSaving(false);
            dispatch(openNotification({ severity: 'success', text: 'Comment successfully reviewed.' }));
            navigate(`/survey/${comment.survey_id}/comments`);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while sending comment review.' }));
            setIsSaving(false);
        }
    };

    const { id, comment_status, reviewed_by, submission_date, review_date, text } = comment;

    if (isLoading) {
        return <CommentReviewSkeleton />;
    }

    return (
        <MetPageGridContainer>
            <Grid
                container
                padding="3em"
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={6}
            >
                <Grid container item rowSpacing={3}>
                    <Grid container item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Comment ID:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetLabelBody sx={{ pl: 2 }}>{id}</MetLabelBody>
                        </Grid>
                    </Grid>

                    <Grid container item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Status:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetLabelBody sx={{ pl: 2 }}>{comment_status.status_name}</MetLabelBody>
                        </Grid>
                    </Grid>

                    <Grid container item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Reviewed by:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetLabelBody sx={{ pl: 2 }}>{reviewed_by}</MetLabelBody>
                        </Grid>
                    </Grid>

                    <Grid container item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Comment Date:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetLabelBody sx={{ pl: 2 }}>{formatDate(submission_date)}</MetLabelBody>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={1}>
                        <Grid item>
                            <MetLabel>Date Reviewed:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetLabelBody sx={{ pl: 2 }}>{formatDate(review_date)}</MetLabelBody>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid xs={12} item>
                        <MetLabel>Comment</MetLabel>
                    </Grid>
                    <Grid xs={12} item>
                        <MetLabelBody>{text}</MetLabelBody>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <FormControl>
                        <FormLabel
                            id="controlled-radio-buttons-group"
                            sx={{ fontWeight: 'bold', color: Palette.text.primary, fontSize: '16px' }}
                        >
                            Comment Approval
                        </FormLabel>
                        <RadioGroup
                            defaultValue={CommentStatus.Accepted}
                            onChange={(e) => handleReviewChange(Number(e.target.value))}
                        >
                            <FormControlLabel
                                value={CommentStatus.Accepted}
                                control={<Radio />}
                                label={<MetLabelBody>Approve</MetLabelBody>}
                            />
                            <FormControlLabel
                                value={CommentStatus.Rejected}
                                control={<Radio />}
                                label={<MetLabelBody>Reject</MetLabelBody>}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" disabled={isSaving} onClick={handleSave}>
                            {'Save & Continue'}
                            {isSaving && <CircularProgress color="inherit" sx={{ marginLeft: 1 }} size={20} />}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/survey/listing')}>
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentReview;
