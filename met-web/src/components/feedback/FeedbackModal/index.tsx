import {
    Box,
    Grid,
    IconButton,
    IconContainerProps,
    InputAdornment,
    Modal,
    Stack,
    TextField,
    Theme,
    SvgIcon,
} from '@mui/material';
import * as React from 'react';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as CheckIcon } from 'assets/images/check.svg';
import { useState } from 'react';
import { MetBody, MetHeader3, MetLabel, modalStyle, PrimaryButton } from '../../common';
import { CommentTypeEnum, createDefaultFeedback, RatingTypeEnum } from 'models/feedback';
import { Else, If, Then, When } from 'react-if';
import { CommentTypeButton, StyledRating } from './styledComponents';
import { createFeedback } from 'services/feedbackService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { customRatings, commentTypes } from './constants';
import { ZIndex } from 'styles/Theme';

export const FeedbackModal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackFormData, setFeedbackFormData] = useState(createDefaultFeedback());
    const [isSaving, setIsSaving] = useState(false);
    const { comment, rating, comment_type } = feedbackFormData;
    const dispatch = useAppDispatch();

    const IconContainer = (props: IconContainerProps) => {
        const { value, ...other } = props;
        return <span {...other}>{customRatings[value].icon}</span>;
    };

    const handleRatingChanged = (value: number) => {
        setFeedbackFormData({
            ...feedbackFormData,
            rating: rating == value ? 0 : value,
        });
    };

    const handleCommentTypeChanged = (value: CommentTypeEnum) => {
        setFeedbackFormData({
            ...feedbackFormData,
            comment_type: comment_type == value ? CommentTypeEnum.None : value,
        });
    };

    const handleCommentChanged = (value: string) => {
        setFeedbackFormData({
            ...feedbackFormData,
            comment: value,
        });
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await createFeedback(feedbackFormData);
            dispatch(openNotification({ severity: 'success', text: 'Your Feedback has been sent.' }));
            setIsSubmitted(true);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while sending your feedback.' }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setIsSubmitted(false);
        setFeedbackFormData(createDefaultFeedback());
        setIsOpen(false);
    };

    const isFeedbackTypeNotSelected = rating === RatingTypeEnum.None && comment_type === CommentTypeEnum.None;
    const isCommentNotProvided = comment_type !== CommentTypeEnum.None && !comment;

    return (
        <>
            <PrimaryButton
                data-testid="feedback-button"
                onClick={() => setIsOpen(true)}
                sx={{
                    borderRadius: '20px 20px 0px 0px',
                    position: 'fixed',
                    bottom: (theme: Theme) => theme.spacing(10),
                    right: (theme: Theme) => theme.spacing(-7),
                    transform: 'rotate(-90deg)',
                    zIndex: ZIndex.footer + 1,
                }}
            >
                <ModeCommentIcon fontSize="small" sx={{ marginRight: 1 }} /> Feedback
            </PrimaryButton>
            <Modal aria-labelledby="modal-title" open={isOpen} onClose={() => handleClose()}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    sx={{ ...modalStyle, paddingX: 2, width: 370 }}
                    rowSpacing={2}
                >
                    <If condition={isSubmitted}>
                        <Then>
                            <Grid item xs={12} justifyContent="center" textAlign="center" alignItems="center">
                                <Stack
                                    justifyContent="center"
                                    textAlign="center"
                                    alignItems="center"
                                    sx={{ height: 200 }}
                                >
                                    <SvgIcon
                                        component={CheckIcon}
                                        fontSize="large"
                                        viewBox="0 0 64 64"
                                        sx={{ marginBottom: 2 }}
                                    />
                                    <MetHeader3 data-testid="success-title">Thank you for your feedback</MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                                <PrimaryButton onClick={handleClose}>Close</PrimaryButton>
                            </Grid>
                        </Then>
                        <Else>
                            <Grid item xs={12} display="flex">
                                <Box flexGrow={1}>
                                    <MetHeader3 id="modal-title" data-testid="feedback-title">
                                        Send us your feedback
                                    </MetHeader3>
                                </Box>
                                <Box sx={{ marginTop: -1, padding: 0 }}>
                                    <IconButton aria-label="close" onClick={handleClose} sx={{ color: 'black' }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel>How do you like our engagement platform?</MetLabel>
                            </Grid>
                            <Grid item xs={12} textAlign="center">
                                <StyledRating
                                    data-testid="rating-input"
                                    value={rating}
                                    size="large"
                                    IconContainerComponent={IconContainer}
                                    highlightSelectedOnly
                                    onChange={(event, newValue) => {
                                        handleRatingChanged(newValue ?? 0);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} justifyContent="space-around" textAlign="center">
                                {customRatings[rating].label}
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel>What else would you like to share with us?</MetLabel>
                            </Grid>
                            <Grid item xs={12} alignItems="flex-start" justifyContent="space-around">
                                <CommentTypeButton
                                    data-testid="comment-type-issue-button"
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Issue)}
                                    sx={{ border: comment_type == CommentTypeEnum.Issue ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Issue].label}</MetBody>
                                        <When condition={!comment_type}>
                                            {commentTypes[CommentTypeEnum.Issue].icon}
                                        </When>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Idea)}
                                    sx={{ border: comment_type == CommentTypeEnum.Idea ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Idea].label}</MetBody>
                                        <When condition={!comment_type}>{commentTypes[CommentTypeEnum.Idea].icon}</When>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Else)}
                                    sx={{ border: comment_type == CommentTypeEnum.Else ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Else].label}</MetBody>
                                        <When condition={!comment_type}>{commentTypes[CommentTypeEnum.Else].icon}</When>
                                    </Stack>
                                </CommentTypeButton>
                            </Grid>
                            <Grid item xs={12}>
                                <When condition={Boolean(comment_type)}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="start"
                                                    sx={{
                                                        padding: '35px 14px',
                                                        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                                                        color: (theme) => theme.palette.text.primary,
                                                    }}
                                                >
                                                    <Stack
                                                        spacing={0}
                                                        justifyContent="space-around"
                                                        alignItems="center"
                                                    >
                                                        <MetBody>{commentTypes[comment_type].label}</MetBody>
                                                        {commentTypes[comment_type].icon}
                                                    </Stack>
                                                </InputAdornment>
                                            ),
                                        }}
                                        data-testid="comment-input"
                                        placeholder={commentTypes[comment_type].text}
                                        onChange={(event) => handleCommentChanged(event.target.value)}
                                        value={comment}
                                        multiline
                                        rows={4}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                paddingLeft: 0,
                                            },
                                        }}
                                    />
                                </When>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                                <PrimaryButton
                                    data-testid="submit-button"
                                    loading={isSaving}
                                    disabled={isFeedbackTypeNotSelected || isCommentNotProvided}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </PrimaryButton>
                            </Grid>
                        </Else>
                    </If>
                </Grid>
            </Modal>
        </>
    );
};
