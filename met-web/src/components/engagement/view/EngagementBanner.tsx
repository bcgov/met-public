import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Button, Grid, Skeleton } from '@mui/material';
import { Banner } from '../banner/Banner';
import { ConditionalComponent } from 'components/common';
import { EngagementBannerProps } from './types';
import { SubmissionStatus } from 'constants/engagementStatus';
import { useAppSelector } from 'hooks';

export const EngagementBanner = ({ startSurvey }: EngagementBannerProps) => {
    const { isEngagementLoading, savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner savedEngagement={savedEngagement}>
            <ConditionalComponent condition={!!surveyId && (isOpen || isPreview)}>
                <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        data-testid="EngagementBanner/share-your-thoughts-button"
                        onClick={startSurvey}
                    >
                        Share your thoughts
                    </Button>
                </Grid>
            </ConditionalComponent>
        </Banner>
    );
};
