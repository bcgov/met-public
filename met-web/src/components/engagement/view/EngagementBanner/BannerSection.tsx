import React from 'react';
import { Grid, Skeleton } from '@mui/material';
import { Banner } from '../../../banner/Banner';
import { PrimaryButton } from 'components/common';
import { SubmissionStatus } from 'constants/engagementStatus';
import { When } from 'react-if';
import EngagementInfoSection from '../EngagementInfoSection';
import { Engagement } from 'models/engagement';

export interface EngagementBannerProps {
    startSurvey: () => void;
    isEngagementLoading: boolean;
    savedEngagement: Engagement | null;
    mockStatus?: SubmissionStatus;
    isLoggedIn: boolean;
}
export const BannerSection = ({
    startSurvey,
    isEngagementLoading,
    savedEngagement,
    isLoggedIn,
    mockStatus,
}: EngagementBannerProps) => {
    const surveyId = savedEngagement?.surveys[0]?.id || '';
    const isPreview = isLoggedIn;
    const currentStatus = isPreview ? mockStatus : savedEngagement?.submission_status;
    const isOpen = currentStatus === SubmissionStatus.Open;

    if (isEngagementLoading || !savedEngagement) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner imageUrl={savedEngagement.banner_url} height="480px">
            <EngagementInfoSection savedEngagement={savedEngagement}>
                <When condition={surveyId && isOpen}>
                    <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                        <PrimaryButton data-testid="EngagementBanner/share-your-thoughts-button" onClick={startSurvey}>
                            Share Your Thoughts
                        </PrimaryButton>
                    </Grid>
                </When>
            </EngagementInfoSection>
        </Banner>
    );
};
