import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Box, Grid, Skeleton, Stack, useMediaQuery, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatus } from 'constants/engagementStatus';
import { ConditionalComponent, MetHeader1, PrimaryButton, SecondaryButton, MetBody } from 'components/common';
import { useAppSelector } from 'hooks';
import ImageIcon from '@mui/icons-material/Image';
import PollIcon from '@mui/icons-material/Poll';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import IconButton from '@mui/material/IconButton';
import ScheduleModal from 'components/common/Modals/Schedule';

export const PreviewBanner = () => {
    const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { isEngagementLoading, savedEngagement } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const engagementId = savedEngagement.id || '';
    const imageExists = !!savedEngagement.banner_url;
    const isScheduled = savedEngagement.status_id === EngagementStatus.Scheduled;
    const engagementBannerText = isScheduled
        ? 'Engagement scheduled - ' + new Date(savedEngagement.scheduled_date).toDateString()
        : `Preview Engagement`;
    if (!isLoggedIn) {
        return null;
    }

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="10em" />;
    }

    return (
        <Box
            sx={{
                backgroundColor: 'secondary.light',
            }}
        >
            <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={4}>
                <ScheduleModal reschedule={isScheduled ? true : false} open={isOpen} updateModal={setIsOpen} />
                <Grid item container direction="row" xs={12} sx={{ pt: 2, mb: 2 }}>
                    <MetHeader1 sx={{ mb: 2 }}>{engagementBannerText}</MetHeader1>
                    <ConditionalComponent condition={isDraft}>
                        <Grid item container direction="row" rowSpacing={isSmallScreen ? 2 : 0.5}>
                            <ConditionalComponent condition={!imageExists}>
                                <Grid item container direction="row" xs={12} lg={8}>
                                    <Grid container direction="row" alignItems="center" item sm={0.5} xs={2}>
                                        <IconButton
                                            sx={{ padding: 0, margin: 0 }}
                                            color="info"
                                            onClick={() => navigate(`/engagements/${engagementId}/form`)}
                                            aria-label="no image"
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item container direction="row" alignItems="center" xs={10} sm={10}>
                                        <MetBody>This engagement is missing a header image.</MetBody>
                                    </Grid>
                                </Grid>
                            </ConditionalComponent>
                            <ConditionalComponent condition={savedEngagement.surveys.length === 0}>
                                <Grid container direction="row" alignItems="center" item xs={12} lg={8}>
                                    <Grid item sm={0.5} xs={2}>
                                        <IconButton
                                            sx={{ padding: 0, margin: 0 }}
                                            color="info"
                                            onClick={() => navigate(`/surveys/create?engagementId=${engagementId}`)}
                                            aria-label="no survey"
                                        >
                                            <PollIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={10} sm={10}>
                                        <MetBody>This engagement is missing a survey.</MetBody>
                                    </Grid>
                                </Grid>
                            </ConditionalComponent>
                            <Grid container direction="row" alignItems="center" item xs={12} lg={8}>
                                <Grid item sm={0.5} xs={2}>
                                    <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="not published">
                                        <UnpublishedIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10} sm={10}>
                                    <MetBody>Please schedule the engagement when ready.</MetBody>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ConditionalComponent>
                </Grid>
                <Grid sx={{ pt: 2 }} item xs={12} container direction="row" justifyContent="flex-end" spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-start">
                        <SecondaryButton
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '4px',
                            }}
                            onClick={() => navigate(`/engagements/${engagementId}/form`)}
                        >
                            Edit Engagement
                        </SecondaryButton>

                        <ConditionalComponent condition={!isScheduled}>
                            <PrimaryButton sx={{ marginLeft: '1em' }} onClick={() => setIsOpen(true)}>
                                Schedule Engagement
                            </PrimaryButton>
                        </ConditionalComponent>
                        <ConditionalComponent condition={isScheduled}>
                            <PrimaryButton sx={{ marginLeft: '1em' }} onClick={() => setIsOpen(true)}>
                                Reschedule Engagement
                            </PrimaryButton>
                        </ConditionalComponent>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
