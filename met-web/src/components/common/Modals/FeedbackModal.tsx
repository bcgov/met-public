import {
    FormControl,
    FormControlLabel,
    Grid,
    IconContainerProps,
    InputAdornment,
    Modal,
    Radio,
    Rating,
    Stack,
    styled,
    TextField,
    Theme,
} from '@mui/material';
import * as React from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';

import { useState } from 'react';
import { ConditionalComponent, MetBody, MetHeader3, MetHeader4, modalStyle, PrimaryButton } from '..';
import { BaseTheme } from 'styles/Theme';

export const FeedbackModal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRating, setSelectedRating] = React.useState(0);
    const [selectedOption, setSelectedOption] = React.useState('');

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
            color: theme.palette.action.disabled,
        },
        textAlign: 'center',
    }));

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
            label: string;
        };
    } = {
        1: {
            icon: <SentimentVeryDissatisfiedIcon color="error" fontSize="large" sx={{ marginX: 1 }} />,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon color="error" fontSize="large" sx={{ marginX: 1 }} />,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon color="warning" fontSize="large" sx={{ marginX: 1 }} />,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon color="success" fontSize="large" sx={{ marginX: 1 }} />,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon color="success" fontSize="large" sx={{ marginX: 1 }} />,
            label: 'Very Satisfied',
        },
    };

    function IconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    function getLabelText() {
        if (selectedRating == 0) return;
        return `${customIcons[selectedRating].label}`;
    }

    function getPlaceholderText() {
        switch (selectedOption) {
            case 'Issue':
                return 'Something does not work...';
            case 'Idea':
                return 'I would like to see...';
            case 'Else':
                return 'I was wondering...';
        }

        return '';
    }

    function handleSubmit() {
        setIsSubmitted(true);
    }

    function handleClose() {
        setIsSubmitted(false);
        setSelectedRating(0);
        setSelectedOption('');
        setIsOpen(false);
    }

    const StyledFormControlLabel = styled(FormControlLabel)(() => ({
        borderColor: BaseTheme.palette.divider,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 1,
        marginRight: 2,
        marginLeft: 2,
        width: 105,
    }));

    return (
        <>
            <PrimaryButton
                onClick={() => setIsOpen(true)}
                sx={{
                    borderRadius: '24px 24px 0px 0px',
                    position: 'fixed',
                    bottom: (theme: Theme) => theme.spacing(10),
                    right: (theme: Theme) => theme.spacing(-8),
                    transform: 'rotate(-90deg)',
                }}
            >
                Your Feedback
            </PrimaryButton>
            <Modal aria-labelledby="modal-title" open={isOpen} onClose={() => handleClose()}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    sx={{ ...modalStyle, paddingX: 2, width: 370, borderRadius: 5 }}
                    rowSpacing={2}
                >
                    <ConditionalComponent condition={isSubmitted}>
                        <Grid item xs={12} justifyContent="center" textAlign="center" alignItems="center">
                            <Stack justifyContent="center" textAlign="center" alignItems="center" sx={{ height: 200 }}>
                                <CheckIcon fontSize="large" color="success" />
                                <MetHeader3 id="modal-title">Thank you for your feedback</MetHeader3>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                            <PrimaryButton disabled={!selectedRating} onClick={handleClose}>
                                Close
                            </PrimaryButton>
                        </Grid>
                    </ConditionalComponent>
                    <ConditionalComponent condition={!isSubmitted}>
                        <Grid item xs={12}>
                            <MetHeader4 id="modal-title">Send us your feedback</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetBody>How do you like our engagement platform?</MetBody>
                        </Grid>
                        <Grid item xs={12} textAlign="center">
                            <StyledRating
                                name="simple-controlled"
                                value={selectedRating}
                                size="large"
                                IconContainerComponent={IconContainer}
                                highlightSelectedOnly
                                onChange={(event, newValue) => {
                                    setSelectedRating(newValue!);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} justifyContent="space-around" textAlign="center">
                            {getLabelText()}
                        </Grid>
                        <Grid item xs={12}>
                            <MetBody>What else would you like to share with us?</MetBody>
                        </Grid>
                        <Grid item xs={12} alignItems="flex-start" justifyContent="space-around" spacing={0}>
                            <ConditionalComponent condition={Boolean(!selectedOption)}>
                                <StyledFormControlLabel
                                    labelPlacement="top"
                                    label="An Issue"
                                    onChange={() => setSelectedOption('Issue')}
                                    control={<Radio checkedIcon={<BugReportIcon />} icon={<BugReportIcon />} />}
                                />
                                <StyledFormControlLabel
                                    labelPlacement="top"
                                    label="An Idea"
                                    onChange={() => setSelectedOption('Idea')}
                                    control={<Radio checkedIcon={<LightbulbIcon />} icon={<LightbulbIcon />} />}
                                />
                                <StyledFormControlLabel
                                    labelPlacement="top"
                                    label="A Question"
                                    onChange={() => setSelectedOption('Else')}
                                    control={<Radio checkedIcon={<QuestionMarkIcon />} icon={<QuestionMarkIcon />} />}
                                />
                            </ConditionalComponent>
                        </Grid>
                        <Grid item xs={12}>
                            <ConditionalComponent condition={Boolean(selectedOption)}>
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
                                                <ConditionalComponent condition={selectedOption === 'Issue'}>
                                                    <Stack
                                                        spacing={0}
                                                        justifyContent="space-around"
                                                        alignItems="center"
                                                    >
                                                        <span>An Issue</span>
                                                        <BugReportIcon
                                                            sx={{
                                                                marginTop: 1,
                                                                color: (theme) => theme.palette.text.primary,
                                                            }}
                                                        />
                                                    </Stack>
                                                </ConditionalComponent>
                                                <ConditionalComponent condition={selectedOption === 'Idea'}>
                                                    <Stack
                                                        spacing={0}
                                                        justifyContent="space-around"
                                                        alignItems="center"
                                                    >
                                                        <span>An Idea</span>
                                                        <LightbulbIcon
                                                            sx={{
                                                                marginTop: 1,
                                                                color: (theme) => theme.palette.text.primary,
                                                            }}
                                                        />
                                                    </Stack>
                                                </ConditionalComponent>
                                                <ConditionalComponent condition={selectedOption === 'Else'}>
                                                    <Stack
                                                        spacing={0}
                                                        justifyContent="space-around"
                                                        alignItems="center"
                                                    >
                                                        <span>A Question</span>
                                                        <QuestionMarkIcon
                                                            sx={{
                                                                marginTop: 1,
                                                                color: (theme) => theme.palette.text.primary,
                                                            }}
                                                        />
                                                    </Stack>
                                                </ConditionalComponent>
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder={getPlaceholderText()}
                                    multiline
                                    rows={4}
                                    maxRows={4}
                                    sx={{
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                            paddingLeft: 0,
                                        },
                                    }}
                                />
                            </ConditionalComponent>
                        </Grid>
                        <Grid item xs={12} display="flex" alignItems="end" justifyContent="flex-end">
                            <PrimaryButton disabled={!selectedRating} onClick={handleSubmit}>
                                Submit
                            </PrimaryButton>
                        </Grid>
                    </ConditionalComponent>
                </Grid>
            </Modal>
        </>
    );
};
