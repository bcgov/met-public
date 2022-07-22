import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Button, Grid, Skeleton } from '@mui/material';
import { Banner } from '../banner/Banner';
import { ConditionalComponent } from 'components/common';
import { EngagementBannerProps } from './types';

export const EngagementBanner = ({ openModal }: EngagementBannerProps) => {
    const { engagementLoading, savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';

    const publishedStatus = savedEngagement.engagement_status.id === 2;
    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner savedEngagement={savedEngagement}>
            <ConditionalComponent condition={!!surveyId && publishedStatus}>
                <Grid item xs={12} container direction="row" justifyContent="flex-end">
                    <Button variant="contained" onClick={openModal}>
                        Share your thoughts
                    </Button>
                </Grid>
            </ConditionalComponent>
        </Banner>
    );
};
