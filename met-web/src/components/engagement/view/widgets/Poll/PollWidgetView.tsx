import React, { useState, useEffect } from 'react';
import { MetPaper, MetHeader2 } from 'components/common';
import { Grid, Skeleton, Divider } from '@mui/material';
import { PrimaryButton } from 'components/common';
import PollDisplay from '../../../form/EngagementWidgets/Poll/PollDisplay';
import { Widget } from 'models/widget';
import { useAppDispatch, useSubmittedPolls } from 'hooks';
import { PollWidget } from 'models/pollWidget';
import { fetchPollWidgets, postPollResponse } from 'services/widgetService/PollService/index';
import { openNotification } from 'services/notificationService/notificationSlice';

import { useAppSelector } from 'hooks';
import { PollStatus } from 'constants/engagementStatus';
interface PollWidgetViewProps {
    widget: Widget;
}

interface HttpResponseError extends Error {
    response?: {
        status: number;
    };
}

const RESPONSE_MESSAGE_SUCCESS = { color: 'green', message: 'Thank you for the response.' };
const RESPONSE_MESSAGE_ERROR = { color: 'red', message: 'An error occurred while submitting the poll.' };
const RESPONSE_MESSAGE_LIMIT = { color: 'red', message: 'Limit exceeded for this poll.' };

const PollWidgetView = ({ widget }: PollWidgetViewProps) => {
    const dispatch = useAppDispatch();
    const [pollWidget, setPollWidget] = useState<PollWidget>({
        id: 0,
        widget_id: 0,
        engagement_id: 0,
        title: '',
        description: '',
        status: '',
        answers: [],
    });

    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [interactionEnabled, setInteractionEnabled] = useState(true);
    const [responseMessage, setResponseMessage] = useState(RESPONSE_MESSAGE_SUCCESS);
    const { getSubmittedPolls, addSubmittedPoll } = useSubmittedPolls();

    useEffect(() => {
        // Check if the current widget ID is in the submitted polls
        if (getSubmittedPolls().includes(widget.id)) {
            setIsSubmitted(true);
        }
        fetchPollDetails();
    }, [widget]);

    const fetchPollDetails = async () => {
        try {
            const poll_widgets = await fetchPollWidgets(widget.id);
            const poll_widget = poll_widgets[poll_widgets.length - 1];
            setPollWidget(poll_widget);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement widgets information',
                }),
            );
        }
    };
    // Type guard for HttpResponseError
    const isHttpResponseError = (error: unknown): error is HttpResponseError => {
        return error instanceof Error && 'response' in error;
    };

    const handleSubmit = async () => {
        if (selectedOption == '') {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'You need to select an answer to the poll before submitting it.',
                }),
            );
            return;
        }
        setInteractionEnabled(false);
        try {
            await postPollResponse(widget.id, pollWidget.id, {
                selected_answer_id: parseInt(selectedOption),
            });
        } catch (error: unknown) {
            const responseMessage =
                isHttpResponseError(error) && error.response?.status === 403
                    ? RESPONSE_MESSAGE_LIMIT
                    : RESPONSE_MESSAGE_ERROR;
            setResponseMessage(responseMessage);
        } finally {
            setInteractionEnabled(true);
        }
        // Irrespective of the error mark the poll as submitted to avoid re-submitting
        setIsSubmitted(true);
        // Add poll to the submitted list of polls
        addSubmittedPoll(widget.id);
    };

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const isPollNotReady = () => {
        if (pollWidget) {
            return pollWidget.status === PollStatus.Inactive || pollWidget.answers.length == 0;
        } else {
            return true;
        }
    };

    if (isPollNotReady()) {
        return null;
    }

    if (isLoading) {
        return (
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <MetHeader2>
                            <Skeleton variant="rectangular" />
                        </MetHeader2>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="20em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    return (
        <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em' }}>
            <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
                <Grid
                    item
                    container
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    flexDirection={'column'}
                    xs={12}
                    paddingBottom={0}
                >
                    <MetHeader2 bold>{widget.title}</MetHeader2>
                    <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                </Grid>
                <Grid item xs={12}>
                    <PollDisplay
                        pollWidget={pollWidget}
                        interactionEnabled={interactionEnabled && !isSubmitted && !isLoggedIn}
                        onOptionChange={handleOptionChange}
                    />
                    {!isLoggedIn && (
                        <>
                            {!isSubmitted ? (
                                <>
                                    <Grid item xs={12} sx={{ marginTop: '1em' }}>
                                        <PrimaryButton onClick={() => handleSubmit()}>Submit</PrimaryButton>
                                    </Grid>
                                </>
                            ) : (
                                <p style={{ color: responseMessage.color }}>{responseMessage.message}</p>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default PollWidgetView;
