import {
    Box,
    Button,
    Grid,
    IconButton,
    IconContainerProps,
    InputAdornment,
    Modal,
    Rating,
    Stack,
    styled,
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
import { MetBody, MetHeader3, MetHeader4, modalStyle, PrimaryButton } from '..';
import { BaseTheme } from 'styles/Theme';
import { createDefaultFeedback } from 'models/feedback';
import { Case, Else, If, Switch, Then } from 'react-if';

export const FeedbackModal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackFormData, setFeedbackFormData] = useState(createDefaultFeedback());
    const { comment, rating, commentType } = feedbackFormData;

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
            opacity: '0.5',
        },
        textAlign: 'center',
    }));

    const customIcons: {
        [index: string]: {
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
    };

    function IconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    function getLabelText() {
        if (rating == 0) return;
        return `${customIcons[rating].label}`;
    }

    function getPlaceholderText() {
        switch (commentType) {
            case 'Issue':
                return 'Something does not work...';
            case 'Idea':
                return 'I would like to see...';
            case 'Else':
                return 'I was wondering...';
        }

        return '';
    }

    function handleRatingChanged(value: number) {
        setFeedbackFormData({
            ...feedbackFormData,
            rating: rating == value ? 0 : value,
        });
    }

    function handleCommentTypeChanged(value: 'Issue' | 'Idea' | 'Else' | '') {
        setFeedbackFormData({
            ...feedbackFormData,
            commentType: commentType == value ? '' : value,
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

    const CommentTypeButton = styled(Button)(() => ({
        borderColor: BaseTheme.palette.divider,
        color: BaseTheme.palette.text.primary,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 3,
        paddingBottom: 5,
        marginRight: 2,
        marginLeft: 2,
        width: 105,
        ':focus': {
            borderColor: BaseTheme.palette.primary.dark,
        },
    }));

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
                                {getLabelText()}
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
                                    onClick={() => handleCommentTypeChanged('Issue')}
                                    sx={{ border: commentType == 'Issue' ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>An Issue</MetBody>
                                        <If condition={!commentType}>
                                            <Then>
                                                <SvgIcon
                                                    component={ExclamationIcon}
                                                    viewBox="0 0 64 64"
                                                    fontSize="large"
                                                />
                                            </Then>
                                            <Else></Else>
                                        </If>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged('Idea')}
                                    sx={{ border: commentType == 'Idea' ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>An Idea</MetBody>
                                        <If condition={!commentType}>
                                            <Then>
                                                <SvgIcon
                                                    component={LightbulbIcon}
                                                    viewBox="0 0 64 64"
                                                    fontSize="large"
                                                />
                                            </Then>
                                            <Else></Else>
                                        </If>
                                    </Stack>
                                </CommentTypeButton>
                                <CommentTypeButton
                                    onClick={() => handleCommentTypeChanged('Else')}
                                    sx={{ border: commentType == 'Else' ? '2px solid black' : '' }}
                                >
                                    <Stack spacing={0} justifyContent="space-around" alignItems="center">
                                        <MetBody>A Question</MetBody>
                                        <If condition={!commentType}>
                                            <Then>
                                                <SvgIcon
                                                    component={ThinkingIcon}
                                                    viewBox="0 0 64 64"
                                                    fontSize="large"
                                                />
                                            </Then>
                                            <Else></Else>
                                        </If>
                                    </Stack>
                                </CommentTypeButton>
                            </Grid>
                            <Grid item xs={12}>
                                <If condition={Boolean(commentType)}>
                                    <Then>
                                        <TextField
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment
                                                        position="start"
                                                        sx={{
                                                            padding: '35px 14px',
                                                            borderRight: (theme) =>
                                                                `1px solid ${theme.palette.divider}`,
                                                            color: (theme) => theme.palette.text.primary,
                                                        }}
                                                    >
                                                        <Switch>
                                                            <Case condition={commentType === 'Issue'}>
                                                                <Stack
                                                                    spacing={0}
                                                                    justifyContent="space-around"
                                                                    alignItems="center"
                                                                >
                                                                    <MetBody>An Issue</MetBody>
                                                                    <SvgIcon
                                                                        component={ExclamationIcon}
                                                                        viewBox="0 0 64 64"
                                                                        fontSize="large"
                                                                    />
                                                                </Stack>
                                                            </Case>
                                                            <Case condition={commentType === 'Idea'}>
                                                                <Stack
                                                                    spacing={0}
                                                                    justifyContent="space-around"
                                                                    alignItems="center"
                                                                >
                                                                    <MetBody>An Idea</MetBody>
                                                                    <SvgIcon
                                                                        component={LightbulbIcon}
                                                                        viewBox="0 0 64 64"
                                                                        fontSize="large"
                                                                    />
                                                                </Stack>
                                                            </Case>
                                                            <Case condition={commentType === 'Else'}>
                                                                <Stack
                                                                    spacing={0}
                                                                    justifyContent="space-around"
                                                                    alignItems="center"
                                                                >
                                                                    <MetBody>A Question</MetBody>
                                                                    <SvgIcon
                                                                        component={ThinkingIcon}
                                                                        viewBox="0 0 64 64"
                                                                        fontSize="large"
                                                                    />
                                                                </Stack>
                                                            </Case>
                                                        </Switch>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            data-testid="comment-input"
                                            placeholder={getPlaceholderText()}
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
                                    </Then>
                                    <Else></Else>
                                </If>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                                <PrimaryButton
                                    data-testid="submit-button"
                                    disabled={Boolean(!rating || (commentType !== '' && !comment))}
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
