import React, { useContext, useEffect, useState } from 'react';
import { Typography, Grid, Stack, Box } from '@mui/material';
import { MetPaper, colors } from '../../../common';
import { ActionContext } from '../ActionContext';
import ImageUpload from 'components/imageUpload';
import { EngagementTabsContext } from './EngagementTabsContext';
import { EngagementStatus } from 'constants/engagementStatus';
import DayCalculatorModal from '../DayCalculator';
import { ENGAGEMENT_CROPPER_ASPECT_RATIO, ENGAGEMENT_UPLOADER_HEIGHT } from './constants';
import RichTextEditor from 'components/common/RichTextEditor';
import { getTextFromDraftJsContentState } from 'components/common/RichTextEditor/utils';
import EngagementContentTabs from './EngagementContent/';
import { TextField, TextInput, Button } from 'components/common/Input';
import { BodyText } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/pro-regular-svg-icons';

const EngagementForm = () => {
    const { isSaving, savedEngagement, handleAddBannerImage, setIsNewEngagement } = useContext(ActionContext);

    const {
        engagementFormData,
        setEngagementFormData,
        handleSaveAndContinueEngagement,
        handlePreviewEngagement,
        handleSaveAndExitEngagement,
        richDescription,
        setRichDescription,
        engagementFormError,
        setEngagementFormError,
    } = useContext(EngagementTabsContext);

    const [initialRichDescription, setInitialRichDescription] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);

    const [isOpen, setIsOpen] = useState(false);

    const { name, start_date, end_date } = engagementFormData;

    useEffect(() => {
        const initialDescription = getTextFromDraftJsContentState(richDescription || savedEngagement.rich_description);
        setInitialRichDescription(richDescription || savedEngagement.rich_description);
        setDescriptionCharCount(initialDescription.length);
    }, [savedEngagement]);

    useEffect(() => {
        setIsNewEngagement(!savedEngagement.id || savedEngagement.id === 0);
    }, [savedEngagement]);

    const getNameError = () => {
        if (name.length > 50) {
            return 'Name must not exceed 50 characters';
        } else if (engagementFormError.name) {
            return 'Name must be specified';
        }
        return '';
    };

    const handleChange = (newValue: string, name?: string) => {
        if (name) {
            setEngagementFormData({
                ...engagementFormData,
                [name]: newValue,
            });
            setEngagementFormError({
                ...engagementFormError,
                [name]: false,
            });
        }
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

    const handleRichDescriptionChange = (newState: string) => {
        setRichDescription(newState);
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
                    <TextField
                        id="engagement-name"
                        data-testid="engagement-form/name"
                        title="Engagement Name"
                        instructions="This will be the main header on your engagement page."
                        counter
                        maxLength={50}
                        name="name"
                        value={name}
                        onChange={handleChange}
                        error={getNameError()}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={{ xs: 1, sm: 0 }}
                    columnSpacing={2}
                >
                    <Grid item xs={12}>
                        <BodyText bold size="large">
                            Engagement Date
                        </BodyText>
                        <BodyText size="small">
                            Specify the date range for the public comment period, during which the public may provide
                            feedback.
                        </BodyText>
                    </Grid>
                    <Grid item xl={4} lg={6} md={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>From</Typography>
                            <TextInput
                                id="from-date"
                                type="date"
                                inputProps={{ max: end_date || null }}
                                name="start_date"
                                value={start_date}
                                disabled={isDateFieldDisabled}
                                onChange={handleChange}
                                error={engagementFormError.start_date}
                            />
                        </Stack>
                        {engagementFormError.start_date && (
                            <Typography className="engagement-form-error" color="error">
                                Start Date must be specified
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xl={4} lg={6} md={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>Until</Typography>
                            <TextInput
                                id="from-date"
                                type="date"
                                inputProps={{ min: start_date || null }}
                                name="end_date"
                                value={end_date}
                                disabled={isDateFieldDisabled}
                                onChange={handleChange}
                                error={engagementFormError.end_date}
                            />
                        </Stack>
                        {engagementFormError.end_date && (
                            <Typography className="engagement-form-error" color="error">
                                End Date must be specified
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xl={4} md={12}>
                        <Stack direction="row" alignItems="center">
                            <Button
                                icon={<FontAwesomeIcon icon={faCalculator} />}
                                variant="secondary"
                                onClick={() => setIsOpen(true)}
                            >
                                Day Calculator
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <BodyText bold size="large">
                        Upload Header Image
                    </BodyText>
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
                    <BodyText bold size="large">
                        Engagement Description
                    </BodyText>
                    <BodyText size="small">
                        This is a short description that will show in the header section of the engagement page.{' '}
                        <span style={{ color: colors.notification.danger.shade, whiteSpace: 'nowrap' }}>
                            Maximum 550 Characters.
                        </span>
                    </BodyText>
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
                    <TextField
                        title="Ministry Name or Project Sponsor"
                        instructions="This is the name of the ministry or other entity responsible for the engagement."
                        id="ministry-name"
                        data-testid="engagement-form/ministry-name"
                        name="sponsor_name"
                        value={engagementFormData.sponsor_name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        title="Call to Action"
                        instructions="This is the text that will appear on the main button on the engagement page."
                        id="call-to-action"
                        data-testid="engagement-form/call-to-action"
                        name="cta_message"
                        value={engagementFormData.cta_message}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        title="Call to Action URL"
                        instructions="This is where the main button on the engagement page will link to."
                        id="call-to-action-url"
                        data-testid="engagement-form/call-to-action-url"
                        name="cta_url"
                        value={engagementFormData.cta_url}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <EngagementContentTabs />
                </Grid>

                <Box
                    position="sticky"
                    bottom={0}
                    width="100%"
                    borderTop="1px solid #ddd"
                    padding={2}
                    marginTop={2}
                    zIndex={1000}
                    boxShadow="0px 0px 5px rgba(0, 0, 0, 0.1)"
                    sx={{ backgroundColor: 'var(--bcds-surface-background-white)' }}
                >
                    <Grid item xs={12}>
                        <Button
                            variant="primary"
                            size="small"
                            sx={{ marginRight: 1 }}
                            data-testid="save-engagement-button"
                            onClick={() => handleSaveAndContinueEngagement()}
                            loading={isSaving}
                        >
                            Save and Continue
                        </Button>
                        <Button
                            variant="primary"
                            size="small"
                            sx={{ marginRight: 1 }}
                            data-testid="save-and-exit-engagement-button"
                            onClick={() => handleSaveAndExitEngagement()}
                            loading={isSaving}
                        >
                            Save and Exit
                        </Button>
                        <Button
                            variant="secondary"
                            size="small"
                            data-testid="preview-engagement-button"
                            onClick={() => handlePreviewEngagement()}
                            disabled={isSaving}
                        >
                            {'Preview'}
                        </Button>
                    </Grid>
                </Box>
            </Grid>
        </MetPaper>
    );
};

export default EngagementForm;
