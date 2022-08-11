import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Box, CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatus } from 'constants/engagementStatus';
import { ConditionalComponent, PrimaryButton, SecondaryButton } from 'components/common';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export const PreviewBanner = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isEngagementLoading, savedEngagement, publishEngagement } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const engagementId = savedEngagement.id || '';
    const [isPublishing, setIsPublishing] = useState(false);

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
                <Grid item xs={12}>
                    <Typography variant="h4">Preview Engagement{!isDraft && ' - Published'}</Typography>
                    <ConditionalComponent condition={isDraft}>
                        <ConditionalComponent condition={savedEngagement.surveys.length === 0}>
                            <Typography variant="body2">This engagement is still missing a survey.</Typography>
                        </ConditionalComponent>
                        <Typography variant="body2" minHeight={25}>
                            Please publish the engagement when ready.
                        </Typography>
                    </ConditionalComponent>
                </Grid>
                <Grid item xs={12} container direction="row" justifyContent="flex-end">
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: '4px',
                        }}
                    >
                        <SecondaryButton
                            variant="outlined"
                            onClick={() => navigate(`/engagement/form/${engagementId}`)}
                        >
                            Edit Engagement
                        </SecondaryButton>
                    </Box>
                    <ConditionalComponent condition={isDraft}>
                        <PrimaryButton sx={{ marginLeft: '1em' }} onClick={() => handlePublishEngagement()}>
                            Publish
                            {isPublishing && <CircularProgress sx={{ marginLeft: 1 }} size={20} />}
                        </PrimaryButton>
                    </ConditionalComponent>
                    <ConditionalComponent condition={!isDraft}>
                        <PrimaryButton sx={{ marginLeft: '1em' }} onClick={() => handleClosePreview()}>
                            Close Preview
                        </PrimaryButton>
                    </ConditionalComponent>
                </Grid>
            </Grid>
        </Box>
    );
};
