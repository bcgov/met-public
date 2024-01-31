import React, { useState, useEffect } from 'react';
import { MetPaper, MetHeader2, PrimaryButton } from 'components/common';
import { Grid, Skeleton, Divider } from '@mui/material';
import PollDisplay from '../../../form/EngagementWidgets/Poll/PollDisplay';
import { Widget } from 'models/widget';
import { useAppDispatch, useSubmittedPolls, useAppSelector } from 'hooks';
import { PollWidget } from 'models/pollWidget';
import { fetchPollWidgets, postPollResponse } from 'services/widgetService/PollService/index';
import { openNotification } from 'services/notificationService/notificationSlice';
import { PollStatus } from 'constants/engagementStatus';
interface PollWidgetViewProps {
    widget: Widget;
}

interface HttpResponseError extends Error {
    response?: {
        status: number;
    };
}

interface ResponseMessage {
    color: string;
    message: string;
}

const RESPONSE_MESSAGE_SUCCESS: ResponseMessage = { color: 'green', message: 'Thank you for the response.' };
const RESPONSE_MESSAGE_RECORDED: ResponseMessage = { color: 'green', message: 'Response already recorded.' };
const RESPONSE_MESSAGE_ERROR: ResponseMessage = { color: 'red', message: 'An error occurred.' };
const RESPONSE_MESSAGE_LIMIT: ResponseMessage = { color: 'red', message: 'Limit exceeded for this poll.' };

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
    const [responseMessage, setResponseMessage] = useState<ResponseMessage | null>(null);
    const { getSubmittedPolls, addSubmittedPoll } = useSubmittedPolls();

    useEffect(() => {
        // Check if the current widget ID is in the submitted polls
        if (getSubmittedPolls().includes(widget.id)) {
            setIsSubmitted(true);
            setResponseMessage(RESPONSE_MESSAGE_RECORDED);
        }
        fetchPollDetails();
    }, [widget]);

    const fetchPollDetails = async () => {
        try {
            const pollWidgets = await fetchPollWidgets(widget.id);
            const pollWidget = pollWidgets[pollWidgets.length - 1];
            setPollWidget(pollWidget);
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
        // Resetting error message
        setResponseMessage(null);

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

            setIsSubmitted(true);
            addSubmittedPoll(widget.id);
            setResponseMessage(RESPONSE_MESSAGE_SUCCESS);
        } catch (error: unknown) {
            let responseMessage = RESPONSE_MESSAGE_ERROR;
            if (isHttpResponseError(error) && error.response?.status === 400) {
                // If  exceed limit error, do not allow them to poll again and added poll to already poll list
                responseMessage = RESPONSE_MESSAGE_LIMIT;
                setIsSubmitted(true);
                addSubmittedPoll(widget.id);
            } else {
                // If not exceed limit error, allow them to poll again
                setIsSubmitted(false);
                setInteractionEnabled(true);
            }
            setResponseMessage(responseMessage);
        }
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
                            {!isSubmitted && (
                                <Grid item xs={12} sx={{ marginTop: '1em' }}>
                                    <PrimaryButton onClick={() => handleSubmit()}>Submit</PrimaryButton>
                                </Grid>
                            )}
                            {responseMessage?.message && (
                                <p style={{ color: responseMessage?.color }}>{responseMessage?.message}</p>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default PollWidgetView;
