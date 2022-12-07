import React, { useState, useEffect } from 'react';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, Stack, FormLabel, Divider } from '@mui/material';
import { getSubmission, reviewComments } from 'services/submissionService';
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
import { CommentStatus } from 'constants/commentStatus';
import { formatDate } from 'components/common/dateHelper';
import { CommentReviewSkeleton } from './CommentReviewSkeleton';
import { createDefaultSubmission, SurveySubmission } from 'models/surveySubmission';
import { If, Then, Else } from 'react-if';

const CommentReview = () => {
    const [submission, setSubmission] = useState<SurveySubmission>(createDefaultSubmission());
    const [review, setReview] = useState(CommentStatus.Approved);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const fetchSubmission = async () => {
        try {
            if (isNaN(Number(submissionId))) {
                throw new Error();
            }

            const fetchedSubmission = await getSubmission(Number(submissionId));
            setSubmission(fetchedSubmission);
            setReview(
                fetchedSubmission.comment_status_id == CommentStatus.Pending
                    ? CommentStatus.Approved
                    : fetchedSubmission.comment_status_id,
            );
            setIsLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comments' }));
            navigate('/');
        }
    };

    useEffect(() => {
        fetchSubmission();
    }, [submissionId]);

    const handleReviewChange = (verdict: number) => {
        setReview(verdict);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await reviewComments({
                submission_id: Number(submissionId),
                status_id: review,
                has_personal_info: true,
                has_profanity: false,
                has_threat: false,
                rejected_reason_other: '',
            });
            setIsSaving(false);
            dispatch(openNotification({ severity: 'success', text: 'Comments successfully reviewed.' }));
            navigate(`/surveys/${submission.survey_id}/comments`);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while sending comments review.' }));
            setIsSaving(false);
        }
    };

    // The comment display information below is fetched from the first comment from the list
    // since comment status/review are being stored individually
    // These values should be exacly the same throughout the array.
    const { id, comment_status_id, reviewed_by, created_date, review_date } = submission;

    if (isLoading) {
        return <CommentReviewSkeleton />;
    }

    const defaultVerdict = comment_status_id !== CommentStatus.Pending ? comment_status_id : CommentStatus.Approved;
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
                            <MetParagraph sx={{ pl: 2 }}>{id}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Status:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ pl: 2 }}>{CommentStatus[comment_status_id]}</MetParagraph>
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
                            <MetParagraph sx={{ pl: 2 }}>{formatDate(created_date)}</MetParagraph>
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
                <Grid container rowSpacing={2} xs={12} paddingTop={5}>
                    <Grid item xs={12} spacing={2}>
                        <Grid xs={12} item>
                            <MetHeader3>Comment(s)</MetHeader3>
                        </Grid>
                    </Grid>
                    {submission.comments?.map((comment) => {
                        return (
                            <Grid item xs={12}>
                                <Divider />
                                <Grid xs={12} item paddingTop={2}>
                                    <MetLabel>{comment.label ?? 'Label not available.'}</MetLabel>
                                </Grid>
                                <Grid xs={12} item>
                                    <MetParagraph>{comment.text}</MetParagraph>
                                </Grid>
                            </Grid>
                        );
                    })}
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                <If condition={!submission.comments || submission.comments.length == 0}>
                    <Then>
                        <Grid container direction="row" item xs={12} spacing={2}>
                            <Grid xs={12} item>
                                <MetLabel>This submission has no comments.</MetLabel>
                            </Grid>
                        </Grid>
                    </Then>
                    <Else>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetHeader3>Comment Approval</MetHeader3>
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
                    </Else>
                </If>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentReview;
