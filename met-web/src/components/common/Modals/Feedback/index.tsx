import {
    Box,
    Grid,
    IconButton,
    IconContainerProps,
    InputAdornment,
    Modal,
    Stack,
    SvgIcon,
    TextField,
    Theme,
} from '@mui/material';
import * as React from 'react';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as CheckIcon } from 'assets/images/check.svg';
import { ReactComponent as ExclamationIcon } from 'assets/images/exclamation.svg';
import { ReactComponent as LightbulbIcon } from 'assets/images/lightbulb.svg';
import { ReactComponent as ThinkingIcon } from 'assets/images/thinking.svg';
import { ReactComponent as VeryDissatisfiedIcon } from 'assets/images/emojiVeryDissatisfied.svg';
import { ReactComponent as DissatisfiedIcon } from 'assets/images/emojiDissatisfied.svg';
import { ReactComponent as NeutralIcon } from 'assets/images/emojiNeutral.svg';
import { ReactComponent as SatisfiedIcon } from 'assets/images/emojiSatisfied.svg';
import { ReactComponent as VerySatisfiedIcon } from 'assets/images/emojiVerySatisfied.svg';
import { useState } from 'react';
import { MetBody, MetHeader3, MetHeader4, modalStyle, PrimaryButton } from '../..';
import { CommentTypeEnum, createDefaultFeedback } from 'models/feedback';
import { Else, If, Then, When } from 'react-if';
import { CommentTypeButton, StyledRating } from './styledComponents';

export const FeedbackModal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackFormData, setFeedbackFormData] = useState(createDefaultFeedback());
    const { comment, rating, commentType } = feedbackFormData;

    const customRatings: {
        [index: number]: {
            icon: React.ReactElement;
            label: string;
        };
    } = {
        5: {
            icon: <SvgIcon fontSize="large" component={VeryDissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
            label: 'Very Dissatisfied',
        },
        4: {
            icon: <SvgIcon fontSize="large" component={DissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 2 }} />,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SvgIcon fontSize="large" component={NeutralIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
            label: 'Neutral',
        },
        2: {
            icon: <SvgIcon fontSize="large" component={SatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 2 }} />,
            label: 'Satisfied',
        },
        1: {
            icon: <SvgIcon fontSize="large" component={VerySatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
            label: 'Very Satisfied',
        },
        0: {
            icon: <></>,
            label: '',
        },
    };

    const commentTypes: {
        [index: number]: {
            icon: React.ReactElement;
            label: string;
            text: string;
        };
    } = {
        1: {
            icon: <SvgIcon component={ExclamationIcon} viewBox="0 0 64 64" fontSize="large" />,
            label: 'An Issue',
            text: 'Something does not work...',
        },
        2: {
            icon: <SvgIcon component={LightbulbIcon} viewBox="0 0 64 64" fontSize="large" />,
            label: 'An Idea',
            text: 'I was wondering...',
        },
        3: {
            icon: <SvgIcon component={ThinkingIcon} viewBox="0 0 64 64" fontSize="large" />,
            label: 'A Question',
            text: 'I was wondering...',
        },
        0: {
            icon: <></>,
            label: '',
            text: '',
        },
    };

    function IconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other}>{customRatings[value].icon}</span>;
    }

    function handleRatingChanged(value: number) {
        setFeedbackFormData({
            ...feedbackFormData,
            rating: rating == value ? 0 : value,
        });
    }

    function handleCommentTypeChanged(value: CommentTypeEnum) {
        setFeedbackFormData({
            ...feedbackFormData,
            commentType: commentType == value ? CommentTypeEnum.None : value,
        });
    }

    function handleCommentChanged(value: string) {
        setFeedbackFormData({
            ...feedbackFormData,
            comment: value,
        });
    }

    function handleSubmit() {
        console.log(feedbackFormData);
        setIsSubmitted(true);
    }

    function handleClose() {
        setIsSubmitted(false);
        setFeedbackFormData(createDefaultFeedback());
        setIsOpen(false);
    }

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
                                    <MetHeader3 id="modal-title">Thank you for your feedback</MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                                <PrimaryButton onClick={handleClose}>Close</PrimaryButton>
                            </Grid>
                        </Then>
                        <Else>
                            <Grid item xs={12} display="flex">
                                <Box flexGrow={1}>
                                    <MetHeader4 id="modal-title" data-testid="feedback-title">
                                        Send us your feedback
                                    </MetHeader4>
                                </Box>
                                <Box sx={{ marginTop: -1, padding: 0 }}>
                                    <IconButton aria-label="close" onClick={handleClose} sx={{ color: 'black' }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>How do you like our engagement platform?</MetBody>
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
                                <MetBody>What else would you like to share with us?</MetBody>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                alignItems="flex-start"
                                justifyContent="space-around"
                                sx={{ paddingTop: 1 }}
                            >
                                <CommentTypeButton
                                    data-testid="comment-type-issue-button"
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Issue)}
                                    sx={{ border: commentType == CommentTypeEnum.Issue ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Issue].label}</MetBody>
                                        <When condition={!commentType}>{commentTypes[CommentTypeEnum.Issue].icon}</When>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Idea)}
                                    sx={{ border: commentType == CommentTypeEnum.Idea ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Idea].label}</MetBody>
                                        <When condition={!commentType}>{commentTypes[CommentTypeEnum.Idea].icon}</When>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged(CommentTypeEnum.Else)}
                                    sx={{ border: commentType == CommentTypeEnum.Else ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>{commentTypes[CommentTypeEnum.Else].label}</MetBody>
                                        <When condition={!commentType}>{commentTypes[CommentTypeEnum.Else].icon}</When>
                                    </Stack>
                                </CommentTypeButton>
                            </Grid>
                            <Grid item xs={12}>
                                <When condition={Boolean(commentType)}>
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
                                                        <MetBody>{commentTypes[commentType].label}</MetBody>
                                                        {commentTypes[commentType].icon}
                                                    </Stack>
                                                </InputAdornment>
                                            ),
                                        }}
                                        data-testid="comment-input"
                                        placeholder={commentTypes[commentType].text}
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
                                    disabled={Boolean(!rating || (commentType !== CommentTypeEnum.None && !comment))}
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
