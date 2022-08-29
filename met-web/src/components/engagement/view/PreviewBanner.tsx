import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Box, Grid, Skeleton, Typography, Stack, useMediaQuery, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatus } from 'constants/engagementStatus';
import { ConditionalComponent, MetHeader1, PrimaryButton, SecondaryButton, MetBody } from 'components/common';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import ImageIcon from '@mui/icons-material/Image';
import PollIcon from '@mui/icons-material/Poll';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import IconButton from '@mui/material/IconButton';

export const PreviewBanner = () => {
    const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isEngagementLoading, savedEngagement, publishEngagement } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const engagementId = savedEngagement.id || '';
    const [isPublishing, setIsPublishing] = useState(false);
    const imageExists = !!savedEngagement.banner_url;

    const handlePublishEngagement = async () => {
        if (savedEngagement.surveys.length === 0) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Please add a survey to the engagement before publishing it',
                }),
            );
            return;
        }
        setIsPublishing(true);
        await publishEngagement({
            ...savedEngagement,
            status_id: EngagementStatus.Published,
            published_date: new Date().toUTCString(),
            surveys: [],
        });
        setIsPublishing(false);
    };

    const handleClosePreview = async () => {
        navigate(`/`);
    };

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
                <Grid item container xs={12}>
                    <MetHeader1 sx={{ mb: 2 }}>Preview Engagement{!isDraft && ' - Published'}</MetHeader1>
                    <ConditionalComponent condition={isDraft}>
                        <Grid item container direction="row" rowSpacing={isSmallScreen ? 2 : 0.5}>
                            <ConditionalComponent condition={!imageExists}>
                                <Grid item container direction="row" xs={12} lg={8}>
                                    <Grid container direction="row" alignItems="center" item sm={0.5} xs={2}>
                                        <IconButton
                                            sx={{ padding: 0, margin: 0 }}
                                            color="info"
                                            onClick={() => navigate(`/engagement/form/${engagementId}`)}
                                            aria-label="no image"
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item container alignItems="center" xs={10} sm={10}>
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
                                            onClick={() => navigate(`/survey/create?engagementId=${engagementId}`)}
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
                                    <MetBody>Please publish the engagement when ready.</MetBody>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ConditionalComponent>
                </Grid>
                <Grid sx={{ pt: 2 }} item xs={12} container direction="row" justifyContent="flex-end" spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                        <SecondaryButton
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '4px',
                            }}
                            onClick={() => navigate(`/engagement/form/${engagementId}`)}
                        >
                            Edit Engagement
                        </SecondaryButton>

                        <ConditionalComponent condition={isDraft}>
                            <PrimaryButton
                                sx={{ marginLeft: '1em' }}
                                onClick={() => handlePublishEngagement()}
                                loading={isPublishing}
                            >
                                Publish
                            </PrimaryButton>
                        </ConditionalComponent>
                        <ConditionalComponent condition={!isDraft}>
                            <PrimaryButton sx={{ marginLeft: '1em' }} onClick={() => handleClosePreview()}>
                                Close Preview
                            </PrimaryButton>
                        </ConditionalComponent>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
