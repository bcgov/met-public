import React, { Suspense } from 'react';
import { Button } from 'components/common/Input/Button';
import { Box, Grid2 as Grid, Skeleton, ThemeProvider } from '@mui/material';
import { Await, useParams } from 'react-router';
import { Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { getStatusFromStatusId, getSubmissionStatusFromPreviewState } from 'components/common/Indicators';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Widget, WidgetLocation } from 'models/widget';
import { BaseTheme, DarkTheme } from 'styles/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Switch, Case } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import EmailModal from 'engagements/public/email/EmailModal';
import { EngagementViewSections } from '.';
import { EngagementPreviewTag } from 'engagements/public/view/EngagementPreviewTag';
import { usePreview } from 'components/engagement/preview/PreviewContext';
import { useEngagementLoaderData } from 'components/engagement/preview/PreviewLoaderDataContext';
import { EngagementWidgetDisplay } from './EngagementWidgetDisplay';
import { TextPlaceholder } from 'components/engagement/preview/placeholders/TextPlaceholder';
import { previewValue, PreviewSwitch } from 'engagements/preview/PreviewSwitch';
import { BodyText, Header2 } from 'components/common/Typography';

const gridContainerStyles = {
    bgcolor: 'blue.90',
    borderRadius: '0px 24px 0px 0px' /* upper right corner */,
    padding: {
        xs: '3em 16px',
        md: '4em 5vw',
        lg: '4.5em 10em',
    },
};

export const EngagementSurveyBlock = () => {
    const { engagement, widgets } = useEngagementLoaderData();
    const surveyBlockContents = Promise.all([engagement, widgets]);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { t: translate } = useAppTranslation();
    const { language } = useParams();
    const { isPreviewMode, previewStateType } = usePreview();

    const [currentPanel, setCurrentPanel] = React.useState('email');
    const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
    const handleOpenEmailModal = () => {
        setCurrentPanel('email');
        setIsEmailModalOpen(true);
        try {
            window.snowplow('trackPageView', 'Verify Email Modal');
        } catch (error) {
            console.log('Verify email modal snowplow error:', error);
        }
    };
    const handleCloseEmailModal = () => {
        setCurrentPanel('email');
        setIsEmailModalOpen(false);
    };

    return (
        <section
            id={EngagementViewSections.PROVIDE_FEEDBACK}
            aria-label="Survey Section"
            style={{ position: 'relative' }}
        >
            <EngagementPreviewTag required>Provide Feedback Section</EngagementPreviewTag>
            <ThemeProvider theme={DarkTheme}>
                <Suspense
                    fallback={
                        <Grid container size={12} justifyContent="space-between" sx={gridContainerStyles}>
                            <Grid
                                sx={{
                                    width: { xs: '100%', md: '47.5%' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '120px',
                                }}
                            >
                                <Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />
                            </Grid>
                            <Grid
                                sx={{
                                    width: { xs: '100%', md: '47.5%' },
                                    display: 'flex',
                                    minHeight: '360px',
                                }}
                            >
                                <Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />
                            </Grid>
                        </Grid>
                    }
                >
                    <Await resolve={surveyBlockContents}>
                        {([engagement, widgets]: [engagement: Engagement, widgets: Widget[]]) => {
                            const hasWidget = widgets.some((widget) => widget.location === WidgetLocation.Feedback);
                            const engagementStatus = engagement.submission_status;
                            const surveyStatus = getStatusFromStatusId(engagementStatus);
                            const usePreviewState = Boolean(isPreviewMode && previewStateType);
                            const effectiveSurveyStatus =
                                previewValue<string>({
                                    isPreviewMode,
                                    hasValue: usePreviewState,
                                    value: previewStateType ?? surveyStatus,
                                    fallback: surveyStatus,
                                }) ?? surveyStatus;
                            const effectiveStatus =
                                previewValue<SubmissionStatus>({
                                    isPreviewMode,
                                    hasValue: usePreviewState,
                                    value: getSubmissionStatusFromPreviewState(previewStateType),
                                    fallback: engagementStatus,
                                }) ?? engagementStatus;
                            const isErrorMessage =
                                isPreviewMode && (previewStateType === 'Upcoming' || previewStateType === 'Closed');
                            const statusBlock = engagement.status_block.find(
                                (block) => block.survey_status === effectiveSurveyStatus,
                            );
                            const hasStatusBlockText = Boolean(
                                statusBlock?.block_text &&
                                getEditorStateFromRaw(statusBlock.block_text)?.getCurrentContent()?.hasText?.(),
                            );
                            const hasFeedbackHeading = Boolean(engagement.feedback_heading?.trim());
                            const feedbackBodyEditorState = getEditorStateFromRaw(engagement.feedback_body || '');
                            const hasFeedbackBody = feedbackBodyEditorState?.getCurrentContent()?.hasText?.() || false;
                            const hasFeedbackContent = hasFeedbackHeading || hasFeedbackBody;
                            const feedbackButtons = engagement.surveys.map((survey) => survey.name);
                            const shouldDisplayFeedbackColumn =
                                isPreviewMode ||
                                (hasStatusBlockText && !isErrorMessage) ||
                                effectiveStatus !== SubmissionStatus.Upcoming;
                            // Outside preview mode, skip if there's nothing to show.
                            if (!isPreviewMode && !hasStatusBlockText && !hasWidget && !hasFeedbackContent) return null;
                            return (
                                <Grid
                                    container
                                    size={12}
                                    rowGap={4}
                                    justifyContent="space-between"
                                    sx={gridContainerStyles}
                                >
                                    <Grid
                                        container
                                        size={{ xs: 12, md: 6 }}
                                        direction="column"
                                        minHeight="120px"
                                        display={shouldDisplayFeedbackColumn ? 'flex' : 'none'}
                                    >
                                        <Box>
                                            <PreviewSwitch
                                                hasValue={hasFeedbackHeading}
                                                value={
                                                    <Header2 decorated weight="thin" sx={{ mt: 0, mb: '16px' }}>
                                                        {engagement.feedback_heading}
                                                    </Header2>
                                                }
                                                previewFallback={
                                                    <Header2 decorated weight="thin" sx={{ mt: 0, mb: '16px' }}>
                                                        <TextPlaceholder text="Provide Feedback Section" />
                                                    </Header2>
                                                }
                                            />
                                            <BodyText component="div">
                                                <PreviewSwitch
                                                    hasValue={hasFeedbackBody}
                                                    value={
                                                        <RichTextArea
                                                            readOnly
                                                            toolbarHidden
                                                            editorState={feedbackBodyEditorState}
                                                        />
                                                    }
                                                    previewFallback={<TextPlaceholder type="paragraph" />}
                                                />
                                            </BodyText>
                                            {/* block_text only shown when it's not in the hero (not Upcoming/Closed in preview) */}
                                            {!isPreviewMode && !isErrorMessage && hasStatusBlockText && (
                                                <RichTextArea
                                                    readOnly
                                                    toolbarHidden
                                                    editorState={getEditorStateFromRaw(statusBlock?.block_text || '')}
                                                />
                                            )}
                                            <ThemeProvider theme={BaseTheme}>
                                                <EmailModal
                                                    engagement={engagement}
                                                    defaultPanel={currentPanel}
                                                    open={isEmailModalOpen}
                                                    handleClose={() => handleCloseEmailModal()}
                                                />
                                            </ThemeProvider>
                                            <PreviewSwitch
                                                hasValue={engagement.surveys.length > 0}
                                                value={
                                                    <Switch>
                                                        <Case condition={effectiveStatus === SubmissionStatus.Open}>
                                                            <Button
                                                                sx={{ mt: '40px' }}
                                                                variant="primary"
                                                                size="large"
                                                                icon={
                                                                    <FontAwesomeIcon
                                                                        fontSize={24}
                                                                        icon={faChevronRight}
                                                                    />
                                                                }
                                                                iconPosition="right"
                                                                onClick={handleOpenEmailModal}
                                                            >
                                                                Provide Feedback Now
                                                            </Button>
                                                        </Case>
                                                        <Case condition={effectiveStatus === SubmissionStatus.Closed}>
                                                            <Button
                                                                sx={{ mt: '40px' }}
                                                                variant="primary"
                                                                size="large"
                                                                icon={
                                                                    <FontAwesomeIcon
                                                                        fontSize={24}
                                                                        icon={faChevronRight}
                                                                    />
                                                                }
                                                                iconPosition="right"
                                                                href={
                                                                    isLoggedIn
                                                                        ? `/engagements/${engagement.id}/dashboard/public`
                                                                        : `/engagements/${engagement.id}/dashboard/public/${language}`
                                                                }
                                                            >
                                                                {translate('buttonText.viewFeedback')}
                                                            </Button>
                                                        </Case>
                                                    </Switch>
                                                }
                                                previewFallback={
                                                    <Box
                                                        sx={{
                                                            mt: '24px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        {feedbackButtons.map((label, index) => (
                                                            <Button
                                                                key={`${label}-${index}`}
                                                                variant="primary"
                                                                icon={
                                                                    <FontAwesomeIcon
                                                                        fontSize={16}
                                                                        icon={faChevronRight}
                                                                    />
                                                                }
                                                                iconPosition="right"
                                                                sx={{ width: 'fit-content' }}
                                                                onClick={() => {
                                                                    return;
                                                                }}
                                                            >
                                                                <TextPlaceholder text={label} />
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid
                                        container
                                        size={{ xs: 12, md: 6 }}
                                        sx={{
                                            display: hasWidget || isPreviewMode ? 'flex' : 'none',
                                        }}
                                    >
                                        <EngagementWidgetDisplay location={WidgetLocation.Feedback} />
                                    </Grid>
                                </Grid>
                            );
                        }}
                    </Await>
                </Suspense>
            </ThemeProvider>
        </section>
    );
};
