import React, { useContext } from 'react';
import Divider from '@mui/material/Divider';
import { Grid, MenuItem, TextField, Select, SelectChangeEvent } from '@mui/material';
import { MetDescription, MetLabel, MidScreenLoader, PrimaryButton, SecondaryButton } from 'components/common';
import { SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { PollContext } from './PollContext';
import { patchPoll, postPoll } from 'services/widgetService/PollService';
import { WidgetTitle } from '../WidgetTitle';
import { PollAnswer } from 'models/pollWidget';
import PollDisplay from './PollDisplay';
import { ActionContext } from '../../ActionContext';
import { PollStatus } from 'constants/engagementStatus';
import Alert from '@mui/material/Alert';
import usePollWidgetState from './PollWidget.hook';
import PollAnswerForm from './PollAnswerForm';

interface DetailsForm {
    title: string;
    description: string;
    answers: PollAnswer[];
    status: string;
}

const previewStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1em',
    borderRadius: '8px',
    marginTop: '1em',
    marginBottom: '1em',
};

const STATUS_ITEMS = [
    { value: PollStatus.Active, label: 'Active' },
    { value: PollStatus.Inactive, label: 'InActive' },
];

const interactionEnabled = false;

const Form = () => {
    const dispatch = useAppDispatch();
    const { widget, isLoadingPollWidget, pollWidget } = useContext(PollContext);
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const [isCreating, setIsCreating] = React.useState(false);
    const { savedEngagement } = useContext(ActionContext);
    const { pollAnswers, setPollAnswers, pollWidgetState, setPollWidgetState, isEngagementPublished } =
        usePollWidgetState(pollWidget, savedEngagement, widget);

    const handleOnSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const answersForSubmission = [...pollAnswers];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventTarget = event.target as any;
        const restructuredData = {
            title: eventTarget['title']?.value,
            description: eventTarget['description']?.value,
            answers: answersForSubmission,
            status: eventTarget['status']?.value,
        };
        setPollAnswers(answersForSubmission);
        onSubmit(restructuredData);
    };

    const savePollWidget = (data: DetailsForm) => (!pollWidget ? createPoll(data) : updatePoll(data));

    const createPoll = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }

        const { title, description, answers, status } = data;
        await postPoll(widget.id, {
            widget_id: widget.id,
            engagement_id: widget.engagement_id,
            title: title,
            description: description,
            answers: answers,
            status: status,
        });
        dispatch(openNotification({ severity: 'success', text: 'A new Poll was successfully added' }));
    };

    const updatePoll = async (data: DetailsForm) => {
        if (!widget || !pollWidget) {
            return;
        }

        if (Object.keys(data).length === 0) {
            return;
        }

        if (!isEngagementPublished) {
            await patchPoll(widget.id, pollWidget.id, { ...data });
        } else {
            // if already published then only update status
            await patchPoll(widget.id, pollWidget.id, { status: data.status });
        }

        dispatch(openNotification({ severity: 'success', text: 'The Poll widget was successfully updated' }));
    };

    const onSubmit: SubmitHandler<DetailsForm> = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }
        try {
            setIsCreating(true);
            await savePollWidget(data);
            setIsCreating(false);
            handleWidgetDrawerOpen(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add the event' }));
            setIsCreating(false);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, property: string) => {
        if (!pollAnswers) {
            return;
        }
        const newValue = e.currentTarget.value;
        if ('description' === property) {
            setPollWidgetState({ ...pollWidgetState, description: newValue });
        } else if ('title' === property) {
            setPollWidgetState({ ...pollWidgetState, title: newValue });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>, property: string) => {
        const newValue = e.target.value;
        if ('status' === property) {
            setPollWidgetState({ ...pollWidgetState, status: newValue });
        }
    };

    const handlePollAnswersChange = (answers: PollAnswer[]) => {
        setPollAnswers(answers);
        setPollWidgetState({ ...pollWidgetState, answers: [...answers] });
    };

    const engagementPublishedAlert = (
        <Alert variant="filled" severity="info">
            Editing of the Poll details is not available once the engagement has been published.
        </Alert>
    );

    if (isLoadingPollWidget || !widget) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <MidScreenLoader />
                </Grid>
            </Grid>
        );
    }

    const pollTitleField = (
        <Grid item xs={12}>
            <MetLabel>Title</MetLabel>
            <MetDescription>The title must be less than 255 characters.</MetDescription>
            <TextField
                id="title"
                data-testid="title"
                name="title"
                variant="outlined"
                label=" "
                InputLabelProps={{
                    shrink: false,
                }}
                fullWidth
                value={pollWidgetState?.title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleTextChange(event, 'title');
                }}
            />
        </Grid>
    );

    const pollDescriptionField = (
        <Grid item xs={12}>
            <MetLabel>Description</MetLabel>
            <TextField
                id="description"
                data-testid="description"
                name="description"
                variant="outlined"
                label=" "
                InputLabelProps={{
                    shrink: false,
                }}
                fullWidth
                multiline
                rows={4}
                value={pollWidgetState?.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleTextChange(event, 'description');
                }}
            />
        </Grid>
    );

    const divider = (
        <Grid item xs={12}>
            <Divider sx={{ marginTop: '1em' }} />
        </Grid>
    );

    const pollAnswersField = (
        <PollAnswerForm initialPollAnswers={pollAnswers} onPollAnswersChange={handlePollAnswersChange} />
    );

    const pollStatusField = (
        <Grid item xs={12}>
            <MetLabel>Status</MetLabel>
            <Select
                name="status"
                data-testid="status"
                value={pollWidgetState?.status}
                fullWidth
                size="small"
                onChange={(event: SelectChangeEvent<string>) => {
                    handleSelectChange(event, 'status');
                }}
            >
                <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }} color="info" disabled>
                    {'(Select One)'}
                </MenuItem>
                {STATUS_ITEMS.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </Grid>
    );

    const pollPreview = (
        <Grid item xs={12} style={previewStyle}>
            <MetLabel style={{ color: '#31a287' }}>Preview</MetLabel>
            {divider}
            <PollDisplay pollWidget={pollWidgetState} interactionEnabled={interactionEnabled} />
        </Grid>
    );
    const pollFormButtons = (
        <Grid
            item
            xs={12}
            container
            direction="row"
            alignItems={'flex-start'}
            justifyContent="flex-start"
            spacing={2}
            mt={'1em'}
        >
            <Grid item>
                <PrimaryButton type="submit" disabled={isCreating} data-testid="save-button">
                    Save & Close
                </PrimaryButton>
            </Grid>
            <Grid item>
                <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>Cancel</SecondaryButton>
            </Grid>
        </Grid>
    );

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={(event) => handleOnSubmit(event)} id="timelineForm">
                    <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            {engagementPublishedAlert}
                        </Grid>
                        {(!isEngagementPublished || (isEngagementPublished && !pollWidget)) && (
                            <>
                                {pollTitleField}
                                {pollDescriptionField}
                                {divider}
                                {pollAnswersField}
                            </>
                        )}
                        {divider}
                        {pollStatusField}
                        {divider}
                        {pollPreview}
                        {pollFormButtons}
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default Form;
