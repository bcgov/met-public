import React, { useContext, useEffect, useState } from 'react';
import { Typography, Grid, TextField, Stack, Box } from '@mui/material';
import { MetPaper, MetLabel, PrimaryButton, SecondaryButton, MetDescription } from '../../../common';
import { ActionContext } from '../ActionContext';
import ImageUpload from 'components/imageUpload';
import { useNavigate } from 'react-router-dom';
import { SurveyBlock } from './SurveyBlock';
import { If, Then, Else } from 'react-if';
import { EngagementTabsContext } from './EngagementTabsContext';
import { EngagementStatus, SUBMISSION_STATUS } from 'constants/engagementStatus';
import DayCalculatorModal from '../DayCalculator';
import { ENGAGEMENT_CROPPER_ASPECT_RATIO, ENGAGEMENT_UPLOADER_HEIGHT } from './constants';
import RichTextEditor from 'components/common/RichTextEditor';
import { getTextFromDraftJsContentState } from 'components/common/RichTextEditor/utils';

const CREATE = 'create';
const EngagementForm = () => {
    const {
        handleCreateEngagementRequest,
        handleUpdateEngagementRequest,
        isSaving,
        savedEngagement,
        handleAddBannerImage,
        fetchEngagement,
    } = useContext(ActionContext);

    const {
        engagementFormData,
        setEngagementFormData,
        richDescription,
        setRichDescription,
        richContent,
        setRichContent,
        engagementFormError,
        setEngagementFormError,
        surveyBlockText,
    } = useContext(EngagementTabsContext);

    const [initialRichDescription, setInitialRichDescription] = useState('');
    const [initialRichContent, setInitialRichContent] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const isNewEngagement = window.location.pathname.includes(CREATE);

    const { name, start_date, end_date, description } = engagementFormData;

    const surveyBlockList = [
        {
            survey_status: SUBMISSION_STATUS.UPCOMING,
            block_text: surveyBlockText.Upcoming,
        },
        {
            survey_status: SUBMISSION_STATUS.OPEN,
            block_text: surveyBlockText.Open,
        },
        {
            survey_status: SUBMISSION_STATUS.CLOSED,
            block_text: surveyBlockText.Closed,
        },
    ];

    useEffect(() => {
        const initialDescription = getTextFromDraftJsContentState(richDescription || savedEngagement.rich_description);
        setInitialRichDescription(richDescription || savedEngagement.rich_description);
        setInitialRichContent(richContent || savedEngagement.rich_content);
        setDescriptionCharCount(initialDescription.length);
    }, []);

    const getErrorMessage = () => {
        if (name.length > 50) {
            return 'Name must not exceed 50 characters';
        } else if (engagementFormError.name) {
            return 'Name must be specified';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            [e.target.name]: e.target.value,
        });
        setEngagementFormError({
            ...engagementFormError,
            [e.target.name]: false,
        });
    };

    const handleDescriptionChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            description: rawText,
        });

        setDescriptionCharCount(rawText.length);

        setEngagementFormError({
            ...engagementFormError,
            description: rawText.length > 550,
        });
    };

    const handleContentChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            content: rawText,
        });
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichDescription(newState);
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    const validateForm = () => {
        const errors = {
            name: !(name && name.length < 50),
            start_date: !start_date,
            end_date: !end_date,
            description: description.length > 550,
        };
        setEngagementFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handleCreateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = await handleCreateEngagementRequest({
            ...engagementFormData,
            rich_description: richDescription,
            rich_content: richContent,
            status_block: surveyBlockList,
        });

        navigate(`/engagements/${engagement.id}/form`);

        return engagement;
    };

    const handleUpdateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        await handleUpdateEngagementRequest({
            ...engagementFormData,
            rich_description: richDescription,
            rich_content: richContent,
            status_block: surveyBlockList,
        });

        fetchEngagement();
        return savedEngagement;
    };

    const handleSaveEngagement = () => {
        if (isNewEngagement) {
            return handleCreateEngagement();
        }

        return handleUpdateEngagement();
    };

    const handlePreviewEngagement = async () => {
        const engagement = await handleSaveEngagement();
        if (!engagement) {
            return;
        }

        navigate(`/engagements/${engagement.id}/view`);
    };

    const isDateFieldDisabled = [EngagementStatus.Closed, EngagementStatus.Unpublished].includes(
        savedEngagement.status_id,
    );

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={4}
                sx={{ padding: '2em' }}
            >
                <DayCalculatorModal open={isOpen} updateModal={setIsOpen} />
                <Grid item xs={12} lg={12} md={12}>
                    <MetLabel>Engagement Name </MetLabel>
                    <MetDescription>This will be the main header on your engagement page.</MetDescription>
                    <TextField
                        id="engagement-name"
                        data-testid="engagement-form/name"
                        variant="outlined"
                        label=" "
                        InputLabelProps={{
                            shrink: false,
                        }}
                        fullWidth
                        name="name"
                        value={name}
                        onChange={handleChange}
                        error={engagementFormError.name || name.length > 50}
                        helperText={getErrorMessage()}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="baseline"
                    rowSpacing={{ xs: 1, sm: 0 }}
                    columnSpacing={2}
                >
                    <Grid item xs={12}>
                        <MetLabel>Engagement Date </MetLabel>
                        <MetDescription>
                            This is the date range of the public comment period, when the public may provide feedback.
                        </MetDescription>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                From
                            </Typography>
                            <TextField
                                id="from-date"
                                type="date"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                InputProps={{ inputProps: { max: end_date || null } }}
                                fullWidth
                                name="start_date"
                                value={start_date}
                                disabled={isDateFieldDisabled}
                                onChange={handleChange}
                                error={engagementFormError.start_date}
                                helperText={engagementFormError.start_date ? 'From Date must be specified' : ''}
                            />
                        </Stack>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>To</Typography>
                            <TextField
                                id="from-date"
                                type="date"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                InputProps={{ inputProps: { min: start_date || null } }}
                                fullWidth
                                name="end_date"
                                value={end_date}
                                disabled={isDateFieldDisabled}
                                onChange={handleChange}
                                error={engagementFormError.end_date}
                                helperText={engagementFormError.end_date ? 'To Date must be specified' : ''}
                            />
                        </Stack>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center">
                            <SecondaryButton sx={{ marginLeft: '1em' }} onClick={() => setIsOpen(true)}>
                                Day Calculator
                            </SecondaryButton>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MetLabel>Upload Header Image</MetLabel>
                    <ImageUpload
                        margin={4}
                        data-testid="engagement-form/image-upload"
                        handleAddFile={handleAddBannerImage}
                        savedImageUrl={savedEngagement.banner_url}
                        savedImageName={savedEngagement.banner_filename}
                        height={ENGAGEMENT_UPLOADER_HEIGHT}
                        cropAspectRatio={ENGAGEMENT_CROPPER_ASPECT_RATIO}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MetLabel>Engagement Description</MetLabel>
                    <MetDescription>
                        This is a short description that will show in the header section of the engagement page.{' '}
                        <span style={{ color: 'red', whiteSpace: 'nowrap' }}>Maximum 550 Characters.</span>
                    </MetDescription>
                    <Box display="flex" flexDirection="column" justifyContent="space-between">
                        <RichTextEditor
                            setRawText={handleDescriptionChange}
                            handleEditorStateChange={handleRichDescriptionChange}
                            initialRawEditorState={initialRichDescription || ''}
                            error={engagementFormError.description}
                            helperText={'Maximum 550 Characters.'}
                        />
                        <Typography alignSelf="flex-end">Character Count: {descriptionCharCount}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <MetLabel>Engagement - Page Content</MetLabel>

                    <MetDescription>This is the main content of the engagement page.</MetDescription>

                    <RichTextEditor
                        setRawText={handleContentChange}
                        handleEditorStateChange={handleRichContentChange}
                        initialRawEditorState={initialRichContent || ''}
                    />
                </Grid>

                <Grid item xs={12}>
                    <SurveyBlock />
                </Grid>

                <Grid item xs={12}>
                    <If condition={isNewEngagement}>
                        <Then>
                            <PrimaryButton
                                sx={{ marginRight: 1 }}
                                data-testid="create-engagement-button"
                                onClick={() => handleCreateEngagement()}
                                loading={isSaving}
                            >
                                Save
                            </PrimaryButton>
                        </Then>
                        <Else>
                            <PrimaryButton
                                data-testid="update-engagement-button"
                                sx={{ marginRight: 1 }}
                                onClick={() => handleUpdateEngagement()}
                                disabled={isSaving}
                                loading={isSaving}
                            >
                                Save
                            </PrimaryButton>
                        </Else>
                    </If>
                    <SecondaryButton
                        data-testid="preview-engagement-button"
                        onClick={() => handlePreviewEngagement()}
                        disabled={isSaving}
                    >
                        {'Preview'}
                    </SecondaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementForm;
