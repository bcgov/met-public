import React, { useState, useEffect } from 'react';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, Stack, FormLabel } from '@mui/material';
import { Comment, createDefaultComment } from 'models/comment';
import { getSubmissionComments, ReviewComment } from 'services/commentService';
import { useAppDispatch } from 'hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import {
    MetLabel,
    MetParagraph,
    MetPageGridContainer,
    PrimaryButton,
    SecondaryButton,
    MetHeader3,
} from 'components/common';
import { Palette } from 'styles/Theme';
import { CommentStatus } from 'constants/commentStatus';
import { formatDate } from 'components/common/dateHelper';
import { CommentReviewSkeleton } from './CommentReviewSkeleton';

const CommentReview = () => {
    const [comments, setComments] = useState<Comment[]>([createDefaultComment()]);
    const [review, setReview] = useState(CommentStatus.Approved);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const fetchComments = async () => {
        try {
            if (isNaN(Number(submissionId))) {
                throw new Error();
            }

            const fetchedComments = await getSubmissionComments(Number(submissionId));
            setComments(fetchedComments);
            setIsLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comment' }));
            navigate('/');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [submissionId]);

    const handleReviewChange = (verdict: number) => {
        setReview(verdict);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await ReviewComment({ submission_id: Number(submissionId), status_id: review });
            setIsSaving(false);
            dispatch(openNotification({ severity: 'success', text: 'Comments successfully reviewed.' }));
            navigate(`/surveys/${comments[0].survey_id}/comments`);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while sending comments review.' }));
            setIsSaving(false);
        }
    };

    const { submission_id, comment_status, reviewed_by, submission_date, review_date } = comments[0];

    if (isLoading) {
        return <CommentReviewSkeleton />;
    }

    const filteredVerdict = [CommentStatus.Approved, CommentStatus.Rejected].filter(
        (verdict) => comments.length > 0 && comments[0].status_id === verdict,
    );
    const defaultVerdict = filteredVerdict.length === 0 ? CommentStatus.Approved : filteredVerdict[0];

    return (
        <MetPageGridContainer>
            <Grid
                container
                direction="row"
                padding="3em"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={6}
            >
                <Grid container direction="row" item rowSpacing={3}>
                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Submission ID:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{submission_id}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Status:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{comment_status.status_name}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Reviewed by:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{reviewed_by}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Comment Date:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{formatDate(submission_date)}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={12} spacing={1}>
                        <Grid item>
                            <MetLabel>Date Reviewed:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{formatDate(review_date)}</MetParagraph>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12} spacing={2}>
                    <Grid xs={12} item>
                        <MetHeader3>Comment(s)</MetHeader3>
                    </Grid>
                </Grid>
                {comments.map((comment) => {
                    return (
                        <Grid container direction="row" item xs={12} spacing={2}>
                            <Grid xs={12} item>
                                <MetLabel>{comment.question ?? 'Question not available.'}</MetLabel>
                            </Grid>
                            <Grid xs={12} item>
                                <MetParagraph>{comment.text}</MetParagraph>
                            </Grid>
                        </Grid>
                    );
                })}
                <Grid item xs={12}>
                    <FormControl>
                        <FormLabel
                            id="controlled-radio-buttons-group"
                            sx={{ fontWeight: 'bold', color: Palette.text.primary, fontSize: '16px' }}
                        >
                            Comment Approval
                        </FormLabel>
                        <RadioGroup
                            defaultValue={defaultVerdict}
                            onChange={(e) => handleReviewChange(Number(e.target.value))}
                        >
                            <FormControlLabel
                                value={CommentStatus.Approved}
                                control={<Radio />}
                                label={<MetParagraph>Approve</MetParagraph>}
                            />
                            <FormControlLabel
                                value={CommentStatus.Rejected}
                                control={<Radio />}
                                label={<MetParagraph>Reject</MetParagraph>}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <PrimaryButton loading={isSaving} onClick={handleSave}>
                            {'Save & Continue'}
                        </PrimaryButton>
                        <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                    </Stack>
                </Grid>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentReview;
