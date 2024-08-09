import React, { Suspense } from 'react';
import { Button } from 'components/common/Input';
import { Box, Grid, Skeleton, ThemeProvider } from '@mui/material';
import { colors } from 'components/common';
import { Await, useLoaderData, useParams } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { getStatusFromStatusId } from 'components/common/Indicators/StatusChip';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Widget } from 'models/widget';
import { WidgetSwitch } from 'components/engagement/view/widgets/WidgetSwitch';
import { BaseTheme, DarkTheme } from 'styles/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Switch, Case } from 'react-if';
import { useAppSelector, useAppTranslation } from 'hooks';
import EmailModal from 'components/engagement/view/EmailModal';

const gridContainerStyles = {
    width: '100%',
    margin: 0,
    background: colors.surface.blue[90],
    color: colors.surface.white,
    borderRadius: '0px 24px 0px 0px' /* upper right corner */,
    padding: {
        xs: '43px 16px 24px 16px',
        md: '32px 5vw 40px 5vw',
        lg: '32px 156px 40px 156px',
    },
    flexDirection: { xs: 'column', md: 'row' },
};

export const EngagementSurveyBlock = () => {
    const { engagement, widgets } = useLoaderData() as { engagement: Promise<Engagement>; widgets: Promise<Widget[]> };
    const surveyBlockContents = Promise.all([engagement, widgets]);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { t: translate } = useAppTranslation();
    const { language } = useParams();

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
        <ThemeProvider theme={DarkTheme}>
            <Suspense
                fallback={
                    <Grid container justifyContent="space-between" sx={gridContainerStyles}>
                        <Grid
                            item
                            sx={{
                                width: { xs: '100%', md: '47.5%' },
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '120px',
                                marginBottom: '48px',
                            }}
                        >
                            <Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />
                        </Grid>
                        <Grid
                            item
                            sx={{
                                width: { xs: '100%', md: '47.5%' },
                                display: 'flex',
                                minHeight: '360px',
                                marginBottom: '48px',
                            }}
                        >
                            <Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />
                        </Grid>
                    </Grid>
                }
            >
                <Await resolve={surveyBlockContents}>
                    {([engagement, widgets]: [engagement: Engagement, widgets: Widget[]]) => {
                        const engagementStatus = engagement.submission_status;
                        const surveyStatus = getStatusFromStatusId(engagementStatus);
                        const statusBlock = engagement.status_block.find(
                            (block) => block.survey_status === surveyStatus,
                        );
                        const widget = widgets?.[1];
                        // No point in rendering if there is no status block or 2nd widget
                        if (!statusBlock?.block_text && !widget) return null;
                        return (
                            <Grid container justifyContent="space-between" sx={gridContainerStyles}>
                                <Grid
                                    component={'section'}
                                    id="survey-section"
                                    aria-label="Survey Section"
                                    item
                                    sx={{
                                        width: { xs: '100%', md: '47.5%' },
                                        display: statusBlock?.block_text ? 'flex' : 'none',
                                        flexDirection: 'column',
                                        minHeight: '120px',
                                        marginBottom: '48px',
                                    }}
                                >
                                    <Box>
                                        <RichTextArea
                                            readOnly
                                            toolbarHidden
                                            editorState={getEditorStateFromRaw(statusBlock?.block_text ?? '')}
                                        />
                                        <ThemeProvider theme={BaseTheme}>
                                            <EmailModal
                                                engagement={engagement}
                                                defaultPanel={currentPanel}
                                                open={isEmailModalOpen}
                                                handleClose={() => handleCloseEmailModal()}
                                            />
                                        </ThemeProvider>
                                        <Switch>
                                            <Case condition={engagement.submission_status === SubmissionStatus.Open}>
                                                <Button
                                                    sx={{ mt: '40px' }}
                                                    variant="primary"
                                                    size="large"
                                                    icon={<FontAwesomeIcon fontSize={24} icon={faChevronRight} />}
                                                    iconPosition="right"
                                                    onClick={handleOpenEmailModal}
                                                >
                                                    Provide Feedback Now
                                                </Button>
                                            </Case>
                                            <Case condition={engagement.submission_status === SubmissionStatus.Closed}>
                                                <Button
                                                    sx={{ mt: '40px' }}
                                                    variant="primary"
                                                    size="large"
                                                    icon={<FontAwesomeIcon fontSize={24} icon={faChevronRight} />}
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
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    sx={{
                                        width: { xs: '100%', md: '47.5%' },
                                        display: widget ? 'flex' : 'none',
                                        minHeight: '360px',
                                        marginBottom: '48px',
                                    }}
                                >
                                    <ThemeProvider theme={BaseTheme}>
                                        {widget && <WidgetSwitch widget={widget} />}
                                    </ThemeProvider>
                                </Grid>
                            </Grid>
                        );
                    }}
                </Await>
            </Suspense>
        </ThemeProvider>
    );
};
