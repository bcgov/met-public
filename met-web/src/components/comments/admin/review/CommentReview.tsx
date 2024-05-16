import React, { useState, useEffect } from 'react';
import {
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    FormLabel,
    Divider,
    Checkbox,
    TextField,
    FormHelperText,
    Link,
} from '@mui/material';
import { getSubmission, reviewComments } from 'services/submissionService';
import { useAppDispatch, useAppTranslation, useAppSelector } from 'hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import {
    MetLabel,
    MetParagraphOld,
    MetPageGridContainer,
    PrimaryButtonOld,
    SecondaryButtonOld,
    MetHeader3,
    MetHeader4,
    MetSmallTextOld,
    MetTooltip,
} from 'components/common';
import { CommentStatus } from 'constants/commentStatus';
import { StaffNoteType } from 'constants/staffNoteType';
import { formatDate } from 'components/common/dateHelper';
import { CommentReviewSkeleton } from './CommentReviewSkeleton';
import { createDefaultSubmission, SurveySubmission } from 'models/surveySubmission';
import { createDefaultReviewNote, createDefaultInternalNote, StaffNote } from 'models/staffNote';
import { If, Then, Else, When } from 'react-if';
import EmailPreviewModal from './emailPreview/EmailPreviewModal';
import { RejectEmailTemplate } from './emailPreview/EmailTemplates';
import EmailPreview from './emailPreview/EmailPreview';
import { Survey, createDefaultSurvey } from 'models/survey';
import { getSurvey } from 'services/surveyService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessageCheck } from '@fortawesome/pro-solid-svg-icons/faMessageCheck';
import { faMessageSlash } from '@fortawesome/pro-solid-svg-icons/faMessageSlash';
import { LanguageState } from 'reduxSlices/languageSlice';

const CommentReview = () => {
    const [submission, setSubmission] = useState<SurveySubmission>(createDefaultSubmission());
    const [review, setReview] = useState(CommentStatus.Approved);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasOtherReason, setHasOtherReason] = useState(false);
    const [hasPersonalInfo, setHasPersonalInfo] = useState(false);
    const [hasProfanity, setHasProfanity] = useState(false);
    const [hasThreat, setHasThreat] = useState(false);
    const [otherReason, setOtherReason] = useState('');
    const [hasError, setHasError] = useState(false);
    const [notifyEmail, setNotifyEmail] = useState(true);
    const [staffNote, setStaffNote] = useState<StaffNote[]>([]);
    const [updatedStaffNote, setUpdatedStaffNote] = useState<StaffNote[]>([]);
    const [openEmailPreview, setEmailPreview] = useState(false);
    const [survey, setSurvey] = useState<Survey>(createDefaultSurvey());
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t: translate } = useAppTranslation();
    const { submissionId, surveyId } = useParams();
    const reviewNotes = updatedStaffNote.filter((staffNote) => staffNote.note_type == StaffNoteType.Review);
    const internalNotes = updatedStaffNote.filter((staffNote) => staffNote.note_type == StaffNoteType.Internal);

    const MAX_OTHER_REASON_CHAR = 500;

    const language: LanguageState = useAppSelector((state) => state.language);

    const getEmailPreview = () => {
        return (
            <EmailPreview survey={survey}>
                <When condition={review == CommentStatus.Rejected}>
                    <RejectEmailTemplate
                        hasPersonalInfo={hasPersonalInfo}
                        hasProfanity={hasProfanity}
                        hasThreat={hasThreat}
                        otherReason={otherReason}
                        reviewNotes={reviewNotes}
                    />
                </When>
            </EmailPreview>
        );
    };

    const fetchSubmission = async () => {
        try {
            if (isNaN(Number(submissionId))) {
                throw new Error();
            }
            const fetchedSubmission = await getSubmission(Number(submissionId));
            const fetchedSurvey = await getSurvey(Number(surveyId));
            setSubmission(fetchedSubmission);
            setSurvey(fetchedSurvey);
            setHasOtherReason(!!fetchedSubmission.rejected_reason_other);
            setOtherReason(fetchedSubmission.rejected_reason_other ?? '');
            setHasPersonalInfo(fetchedSubmission.has_personal_info ?? false);
            setHasProfanity(fetchedSubmission.has_profanity ?? false);
            setHasThreat(fetchedSubmission.has_threat ?? false);
            setNotifyEmail(fetchedSubmission.notify_email ?? true);
            setStaffNote(fetchedSubmission.staff_note);
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

    const extract_staff_note = async () => {
        setUpdatedStaffNote(
            staffNote.length !== 0 ? staffNote : [createDefaultReviewNote(), createDefaultInternalNote()],
        );
    };

    useEffect(() => {
        fetchSubmission();
    }, [submissionId]);

    useEffect(() => {
        extract_staff_note();
    }, [staffNote]);

    const handleReviewChange = (verdict: number) => {
        setReview(verdict);
        if (review === CommentStatus.Approved) {
            setHasOtherReason(false);
            setOtherReason('');
            setHasPersonalInfo(false);
            setHasProfanity(false);
            setHasThreat(false);
            setNotifyEmail(true);
        }
    };

    const validate = (): boolean => {
        if (review == CommentStatus.Rejected) {
            if (hasOtherReason && !otherReason) {
                // Other reason is mandatory if selected
                return false;
            }
            // At least one reason is selected
            return hasOtherReason || hasPersonalInfo || hasProfanity || hasThreat;
        }
        return true;
    };
    const handleSave = async () => {
        const isValid = validate();
        setHasError(!isValid);
        if (!isValid) {
            return;
        }
        setIsSaving(true);
        try {
            await reviewComments({
                submission_id: Number(submissionId),
                status_id: review,
                has_personal_info: hasPersonalInfo,
                has_profanity: hasProfanity,
                has_threat: hasThreat,
                rejected_reason_other: otherReason,
                notify_email: notifyEmail,
                staff_note: updatedStaffNote,
                language: language.id,
            });
            setIsSaving(false);
            dispatch(openNotification({ severity: 'success', text: 'Comments successfully reviewed.' }));
            navigate(`/surveys/${submission.survey_id}/comments`);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while sending comments review.' }));
            setIsSaving(false);
        }
    };

    const previewEmail = () => {
        setEmailPreview(true);
    };

    // The comment display information below is fetched from the first comment from the list
    // since comment status/review are being stored individually
    // These values should be exacly the same throughout the array.
    const { id, comment_status_id, reviewed_by, created_date, review_date } = submission;

    if (isLoading) {
        return <CommentReviewSkeleton />;
    }

    const handleNoteChange = (note: string, note_type: string, note_id: number) => {
        const newStaffNoteArray = [...updatedStaffNote];
        newStaffNoteArray.forEach((staffNote) => {
            if (staffNote.id === note_id && staffNote.note_type === note_type) {
                staffNote.note = note;
            }
        });
        setUpdatedStaffNote(newStaffNoteArray);
    };

    const defaultVerdict = comment_status_id !== CommentStatus.Pending ? comment_status_id : CommentStatus.Approved;
    const threatEmailContact = translate('comment.admin.review.threatContactEmail');
    return (
        <MetPageGridContainer>
            <EmailPreviewModal
                open={openEmailPreview}
                handleClose={() => setEmailPreview(false)}
                header={'Your comment on (Engagement name) needs to be edited'}
                renderEmail={getEmailPreview()}
            />
            <Grid
                container
                direction="row"
                padding="3em"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={4}
            >
                <Grid container direction="row" item rowSpacing={2}>
                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Comment ID:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraphOld sx={{ pl: 2 }}>{id}</MetParagraphOld>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Status:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraphOld sx={{ pl: 2 }}>{CommentStatus[comment_status_id]}</MetParagraphOld>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Comment Date:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraphOld sx={{ pl: 2 }}>{formatDate(created_date)}</MetParagraphOld>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Reviewed by:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraphOld sx={{ pl: 2 }}>{reviewed_by}</MetParagraphOld>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" item xs={6} spacing={1}></Grid>
                    <Grid container direction="row" item xs={6} spacing={1}>
                        <Grid item>
                            <MetLabel>Date Reviewed:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraphOld sx={{ pl: 2 }}>{formatDate(review_date)}</MetParagraphOld>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container rowSpacing={2} paddingTop={5}>
                    <Grid item xs={12}>
                        <Grid xs={12} item>
                            <MetHeader3>Comment(s)</MetHeader3>
                        </Grid>
                    </Grid>
                    {submission.comments?.map((comment) => {
                        return (
                            <Grid key={comment.id} item xs={12}>
                                <Divider />
                                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                                    <Grid item xs={1} paddingTop={3}>
                                        <If condition={comment.is_displayed}>
                                            <Then>
                                                <Grid xs={12} item>
                                                    <MetTooltip
                                                        disableInteractive
                                                        title={'Displayed to the public'}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faMessageCheck}
                                                                style={{ fontSize: '24px', color: '#757575' }}
                                                            />
                                                        </span>
                                                    </MetTooltip>
                                                </Grid>
                                            </Then>
                                            <Else>
                                                <Grid xs={12} item>
                                                    <MetTooltip
                                                        disableInteractive
                                                        title={'Not displayed to the public'}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faMessageSlash}
                                                                style={{ fontSize: '24px', color: '#757575' }}
                                                            />
                                                        </span>
                                                    </MetTooltip>
                                                </Grid>
                                            </Else>
                                        </If>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Grid xs={12} item paddingTop={2}>
                                            <MetLabel>{comment.label ?? 'Label not available.'}</MetLabel>
                                        </Grid>
                                        <Grid xs={12} item>
                                            <MetParagraphOld>{comment.text}</MetParagraphOld>
                                        </Grid>
                                    </Grid>
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
                                    <MetHeader3 sx={{ color: '#494949' }}>Comments Approval</MetHeader3>
                                </FormLabel>
                                <RadioGroup
                                    defaultValue={defaultVerdict}
                                    onChange={(e) => handleReviewChange(Number(e.target.value))}
                                >
                                    <FormControlLabel
                                        value={CommentStatus.Approved}
                                        control={<Radio />}
                                        label={<MetParagraphOld>Approve</MetParagraphOld>}
                                    />
                                    <FormControlLabel
                                        value={CommentStatus.Rejected}
                                        control={<Radio />}
                                        label={<MetParagraphOld>Reject</MetParagraphOld>}
                                    />
                                    <FormControlLabel
                                        value={CommentStatus.NeedsFurtherReview}
                                        control={<Radio />}
                                        label={<MetParagraphOld>Needs further review</MetParagraphOld>}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <When condition={review == CommentStatus.Rejected}>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel id="controlled-checkbox-group">
                                        <MetHeader4 sx={{ color: '#494949' }}>Reason for Rejection</MetHeader4>
                                    </FormLabel>
                                    <FormControlLabel
                                        label={<MetParagraphOld>Contains personal information</MetParagraphOld>}
                                        control={
                                            <Checkbox
                                                checked={hasPersonalInfo}
                                                onChange={(event, checked) => setHasPersonalInfo(checked)}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label={
                                            <MetParagraphOld>
                                                Contains profanity or inappropriate language
                                            </MetParagraphOld>
                                        }
                                        control={
                                            <Checkbox
                                                checked={hasProfanity}
                                                onChange={(event, checked) => setHasProfanity(checked)}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label={<MetParagraphOld>Contains threat/menace</MetParagraphOld>}
                                        control={
                                            <Checkbox
                                                checked={hasThreat}
                                                onChange={(event, checked) => setHasThreat(checked)}
                                            />
                                        }
                                    />
                                    <MetSmallTextOld bold color="#d32f2f" marginLeft={'3em'} mt={'-1em'}>
                                        {translate('comment.admin.review.threatTextOne')}{' '}
                                        {translate('comment.admin.review.threatContact')}{' '}
                                        {translate('comment.admin.review.threatTextTwo')}{' '}
                                        <Link href={`mailto:${threatEmailContact}`}>{threatEmailContact}</Link>
                                    </MetSmallTextOld>
                                    <FormControlLabel
                                        label={<MetParagraphOld sx={{ color: '#494949' }}>Other</MetParagraphOld>}
                                        control={
                                            <Checkbox
                                                checked={hasOtherReason}
                                                onChange={(event, checked) => {
                                                    setHasOtherReason(checked);
                                                    if (!checked) {
                                                        setOtherReason('');
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                    <MetParagraphOld sx={{ marginLeft: '3em', color: '#707070', fontSize: '13px' }}>
                                        This will be inserted in the email sent to the respondent:
                                        <MetParagraphOld
                                            sx={{ fontStyle: 'italic', color: '#707070', fontSize: '13px' }}
                                        >
                                            We have reviewed your feedback and can't accept it for the following
                                            reason(s): - Your feedback contains "other"
                                        </MetParagraphOld>
                                    </MetParagraphOld>
                                    <TextField
                                        disabled={!hasOtherReason}
                                        value={otherReason}
                                        sx={{ marginLeft: '2em' }}
                                        FormHelperTextProps={{ error: true }}
                                        onChange={(event) => setOtherReason(event.target.value)}
                                        inputProps={{ maxLength: MAX_OTHER_REASON_CHAR }}
                                        multiline
                                    />
                                    <br />
                                    <MetParagraphOld sx={{ fontWeight: 'bold', color: '#494949' }}>
                                        Review Notes
                                    </MetParagraphOld>
                                    <MetParagraphOld sx={{ color: '#707070', fontSize: '13px' }}>
                                        This note will be inserted in the email sent to the respondent to help them
                                        understand what needs to be edited for their comment(s) to be approved.
                                    </MetParagraphOld>
                                    {reviewNotes.map((staffNote) => {
                                        return (
                                            <TextField
                                                value={staffNote.note}
                                                key={staffNote.note_type}
                                                fullWidth
                                                multiline={true}
                                                rows={4}
                                                FormHelperTextProps={{ error: true }}
                                                onChange={(event) => {
                                                    handleNoteChange(
                                                        event.target.value,
                                                        staffNote.note_type,
                                                        staffNote.id,
                                                    );
                                                }}
                                            />
                                        );
                                    })}

                                    <When condition={review == CommentStatus.Rejected && notifyEmail && !hasThreat}>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{ m: 1 }}
                                            container
                                            alignItems="flex-end"
                                            justifyContent="flex-end"
                                        >
                                            <SecondaryButtonOld onClick={previewEmail}>
                                                {'Preview Email'}
                                            </SecondaryButtonOld>
                                        </Grid>
                                    </When>
                                    <br />
                                    <MetLabel>Internal Note</MetLabel>
                                    {internalNotes.map((staffNote) => {
                                        return (
                                            <TextField
                                                value={staffNote.note}
                                                key={staffNote.note_type}
                                                fullWidth
                                                multiline={true}
                                                rows={4}
                                                FormHelperTextProps={{ error: true }}
                                                onChange={(event) => {
                                                    handleNoteChange(
                                                        event.target.value,
                                                        staffNote.note_type,
                                                        staffNote.id,
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                    <br />
                                    <MetParagraphOld>
                                        Clicking the "Save" button will trigger an automatic email to be sent to the
                                        person who made this comment. They will have the option to edit and re-submit
                                        their comment. The edited comment will have to be approved before it is
                                        published.
                                    </MetParagraphOld>
                                    <br />
                                    <FormControlLabel
                                        label={
                                            <MetParagraphOld>
                                                Don't send this email to the person who commented.
                                            </MetParagraphOld>
                                        }
                                        control={
                                            <Checkbox
                                                checked={notifyEmail === true ? false : true}
                                                onChange={(event, checked) =>
                                                    setNotifyEmail(checked === true ? false : true)
                                                }
                                            />
                                        }
                                    />
                                    <br />
                                    <FormHelperText error={true}>
                                        {hasError
                                            ? 'Please enter at least one reason for rejecting the comment(s).'
                                            : ''}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </When>
                        <When condition={review !== CommentStatus.Rejected}>
                            <Grid item xs={12}>
                                <MetLabel>Internal Note</MetLabel>
                                {internalNotes.map((staffNote) => {
                                    return (
                                        <TextField
                                            value={staffNote.note}
                                            key={staffNote.note_type}
                                            fullWidth
                                            multiline={true}
                                            rows={4}
                                            FormHelperTextProps={{ error: true }}
                                            onChange={(event) => {
                                                handleNoteChange(event.target.value, staffNote.note_type, staffNote.id);
                                            }}
                                        />
                                    );
                                })}
                            </Grid>
                        </When>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <PrimaryButtonOld loading={isSaving} onClick={handleSave}>
                                    {'Save & Continue'}
                                </PrimaryButtonOld>

                                <SecondaryButtonOld onClick={() => navigate(-1)}>Cancel</SecondaryButtonOld>
                            </Stack>
                        </Grid>
                    </Else>
                </If>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentReview;
