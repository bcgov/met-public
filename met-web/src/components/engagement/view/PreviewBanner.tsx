import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatus } from 'constants/engagementStatus';
import { ConditionalComponent } from 'components/common';
import { useAppSelector } from 'hooks';

export const PreviewBanner = () => {
    const navigate = useNavigate();
    const { engagementLoading, savedEngagement, publishEngagement } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const engagementId = savedEngagement.id || '';

    const handlePublishEngagement = async () => {
        await publishEngagement({
            ...savedEngagement,
            status_id: EngagementStatus.Published,
            published_date: new Date().toUTCString(),
            surveys: [],
        });
    };

    const handleClosePreview = async () => {
        navigate(`/`);
    };

    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="10em" />;
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <Box
            sx={{
                backgroundColor: 'secondary.light',
            }}
        >
            <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={4}>
                <Grid item xs={12}>
                    <Typography variant="h4">Preview Engagement{isDraft ? '' : ' - Published'}</Typography>
                    <Typography variant="body2" minHeight={25}>
                        {isDraft ? 'This engagement must be published. Please publish it when ready.' : ''}
                    </Typography>
                </Grid>
                <Grid item xs={12} container direction="row" justifyContent="flex-end">
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: '4px',
                        }}
                    >
                        <Button variant="outlined" onClick={() => navigate(`/engagement/form/${engagementId}`)}>
                            Edit Engagement
                        </Button>
                    </Box>
                    <ConditionalComponent condition={isDraft}>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '1em' }}
                            onClick={() => handlePublishEngagement()}
                        >
                            Publish
                        </Button>
                    </ConditionalComponent>
                    <ConditionalComponent condition={!isDraft}>
                        <Button variant="contained" sx={{ marginLeft: '1em' }} onClick={() => handleClosePreview()}>
                            Close Preview
                        </Button>
                    </ConditionalComponent>
                </Grid>
            </Grid>
        </Box>
    );
};
