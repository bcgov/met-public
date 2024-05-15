import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Box, Typography, Grid, Skeleton, Stack, useMediaQuery, Theme, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatusChip } from '../status';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';
import { MetHeader1Old, PrimaryButtonOld, SecondaryButtonOld, MetBodyOld, MetPaper } from 'components/common';
import { useAppSelector } from 'hooks';
import ImageIcon from '@mui/icons-material/Image';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import IconButton from '@mui/material/IconButton';
import ScheduleModal from 'components/engagement/view/ScheduleModal';
import ArticleIcon from '@mui/icons-material/Article';
import { formatDate } from 'components/common/dateHelper';
import { When } from 'react-if';
import { PermissionsGate } from 'components/permissionsGate';
import { USER_ROLES } from 'services/userService/constants';
import UnpublishModal from './UnpublishModal';

export const PreviewBanner = () => {
    const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false);
    const { content, isEngagementLoading, savedEngagement, updateMockStatus, mockStatus } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const engagementId = savedEngagement.id || '';
    const imageExists = !!savedEngagement.banner_url;
    const isScheduled = savedEngagement.status_id === EngagementStatus.Scheduled;
    const isPublished = savedEngagement.status_id === EngagementStatus.Published;
    const scheduledDate = formatDate(savedEngagement.scheduled_date, 'MMM DD YYYY');
    const scheduledTime = formatDate(savedEngagement.scheduled_date, 'HH:mm');
    const engagementBannerText = isScheduled
        ? 'Engagement scheduled - ' + scheduledDate + ' at ' + scheduledTime + ' PT'
        : `Preview Engagement`;

    if (!isLoggedIn) {
        return null;
    }

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="10em" />;
    }

    return (
        <>
            <ScheduleModal
                reschedule={Boolean(isScheduled)}
                open={isScheduleModalOpen}
                updateModal={setIsScheduleModalOpen}
            />
            <UnpublishModal open={isUnpublishModalOpen} setModalOpen={setIsUnpublishModalOpen} />
            <Box
                sx={{
                    backgroundColor: 'secondary.light',
                }}
            >
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={4}>
                    <Grid item container direction="row" xs={8} sx={{ pt: 2, mb: 2 }}>
                        <MetHeader1Old sx={{ mb: 2 }}>{engagementBannerText}</MetHeader1Old>
                        <When condition={isScheduled}>
                            <Grid item container direction="row" rowSpacing={1}>
                                <MetBodyOld>
                                    This engagement is scheduled to go live on
                                    {' ' + scheduledDate + ' at ' + scheduledTime + ' PT'}.{' '}
                                    <Link onClick={() => setIsScheduleModalOpen(true)}>Click here</Link> to edit the
                                    date this Engagement page will go live.
                                </MetBodyOld>
                            </Grid>
                        </When>
                        <When condition={isDraft}>
                            <Grid item container direction="row" rowSpacing={isSmallScreen ? 2 : 1}>
                                <When condition={!imageExists}>
                                    <Grid item container direction="row" xs={12} lg={8}>
                                        <Grid item>
                                            <IconButton
                                                sx={{ padding: 0, margin: 0 }}
                                                color="inherit"
                                                onClick={() => navigate(`/engagements/${engagementId}/form`)}
                                                aria-label="no image"
                                            >
                                                <ImageIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item container direction="row" alignItems="center" xs={10} sm={11}>
                                            <MetBodyOld>This engagement is missing a header image.</MetBodyOld>
                                        </Grid>
                                    </Grid>
                                </When>
                                <When condition={savedEngagement.surveys.length === 0}>
                                    <Grid container direction="row" alignItems="center" item xs={12} lg={10}>
                                        <Grid item>
                                            <IconButton
                                                sx={{ padding: 0, margin: 0 }}
                                                color="inherit"
                                                onClick={() => navigate(`/surveys/create?engagementId=${engagementId}`)}
                                                aria-label="no survey"
                                            >
                                                <ArticleIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <MetBodyOld>This engagement is missing a survey.</MetBodyOld>
                                        </Grid>
                                    </Grid>
                                </When>
                                <When condition={!savedEngagement.description}>
                                    <Grid container direction="row" alignItems="center" item xs={12} lg={10}>
                                        <Grid item>
                                            <IconButton
                                                sx={{ padding: 0, margin: 0 }}
                                                color="inherit"
                                                onClick={() => navigate(`/engagements/${engagementId}/form`)}
                                                aria-label="no description"
                                            >
                                                <ArticleIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <MetBodyOld>This engagement is missing a description.</MetBodyOld>
                                        </Grid>
                                    </Grid>
                                </When>
                                <When condition={!content}>
                                    <Grid container direction="row" alignItems="center" item xs={12} lg={10}>
                                        <Grid item>
                                            <IconButton
                                                sx={{ padding: 0, margin: 0 }}
                                                color="inherit"
                                                onClick={() => navigate(`/engagements/${engagementId}/form`)}
                                                aria-label="no content"
                                            >
                                                <ArticleIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <MetBodyOld>This engagement is missing content.</MetBodyOld>
                                        </Grid>
                                    </Grid>
                                </When>
                                <Grid container direction="row" alignItems="center" item xs={12} lg={10}>
                                    <Grid item>
                                        <IconButton
                                            sx={{ padding: 0, margin: 0 }}
                                            color="inherit"
                                            aria-label="not published"
                                        >
                                            <UnpublishedIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item sm={11}>
                                        <MetBodyOld>
                                            An Administrator can schedule the engagement when ready.
                                        </MetBodyOld>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </When>
                    </Grid>
                    <Grid item container direction="row" alignItems="flex-end" justifyContent="flex-end" xs={4}>
                        <MetPaper sx={{ p: 1, borderColor: '#cdcdcd' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', pb: '8px' }}>
                                Click to View Different Engagement Status:
                            </Typography>
                            <Stack spacing={1} direction={{ md: 'row' }} alignItems="center" justifyContent="center">
                                <IconButton onClick={() => updateMockStatus(SubmissionStatus.Upcoming)}>
                                    <EngagementStatusChip
                                        submissionStatus={SubmissionStatus.Upcoming}
                                        active={mockStatus === SubmissionStatus.Upcoming}
                                        clickable
                                    />
                                </IconButton>
                                <IconButton onClick={() => updateMockStatus(SubmissionStatus.Open)}>
                                    <EngagementStatusChip
                                        submissionStatus={SubmissionStatus.Open}
                                        active={mockStatus === SubmissionStatus.Open}
                                        clickable
                                    />
                                </IconButton>
                                <IconButton onClick={() => updateMockStatus(SubmissionStatus.Closed)}>
                                    <EngagementStatusChip
                                        submissionStatus={SubmissionStatus.Closed}
                                        active={mockStatus === SubmissionStatus.Closed}
                                        clickable
                                    />
                                </IconButton>
                            </Stack>
                        </MetPaper>
                    </Grid>
                    <Grid sx={{ pt: 2 }} item xs={12} container direction="row" justifyContent="flex-end" spacing={1}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-start"
                        >
                            <PermissionsGate scopes={[USER_ROLES.EDIT_ENGAGEMENT]} errorProps={{ disabled: true }}>
                                <SecondaryButtonOld
                                    sx={{
                                        backgroundColor: 'background.paper',
                                        borderRadius: '4px',
                                    }}
                                    onClick={() => navigate(`/engagements/${engagementId}/form`)}
                                >
                                    Edit Engagement
                                </SecondaryButtonOld>
                            </PermissionsGate>

                            <When condition={isPublished}>
                                <PermissionsGate
                                    scopes={[USER_ROLES.UNPUBLISH_ENGAGEMENT]}
                                    errorProps={{ disabled: true }}
                                >
                                    <PrimaryButtonOld
                                        sx={{ marginLeft: '1em' }}
                                        onClick={() => setIsUnpublishModalOpen(true)}
                                    >
                                        Unpublish Engagement
                                    </PrimaryButtonOld>
                                </PermissionsGate>
                            </When>

                            <When condition={isDraft}>
                                <PermissionsGate
                                    scopes={[USER_ROLES.PUBLISH_ENGAGEMENT]}
                                    errorProps={{ disabled: true }}
                                >
                                    <PrimaryButtonOld
                                        sx={{ marginLeft: '1em' }}
                                        onClick={() => setIsScheduleModalOpen(true)}
                                    >
                                        Schedule Engagement
                                    </PrimaryButtonOld>
                                </PermissionsGate>
                            </When>
                            <When condition={isScheduled}>
                                <PermissionsGate
                                    scopes={[USER_ROLES.PUBLISH_ENGAGEMENT]}
                                    errorProps={{ disabled: true }}
                                >
                                    <PrimaryButtonOld
                                        sx={{ marginLeft: '1em' }}
                                        onClick={() => setIsScheduleModalOpen(true)}
                                    >
                                        Reschedule Engagement
                                    </PrimaryButtonOld>
                                </PermissionsGate>
                            </When>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
