import React from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from '../../../banner/Banner';
import { SubmissionStatus } from 'constants/engagementStatus';
import EngagementInfoSection from '../EngagementInfoSection';
import { Engagement } from 'models/engagement';

export interface EngagementBannerProps {
    isEngagementLoading: boolean;
    savedEngagement: Engagement | null;
    isLoggedIn: boolean;
    mockStatus?: SubmissionStatus;
    surveyButton?: React.ReactNode;
}
export const BannerSection = ({ isEngagementLoading, savedEngagement, surveyButton }: EngagementBannerProps) => {
    if (isEngagementLoading || !savedEngagement) {
        return <Skeleton variant="rectangular" width="100%" height="480px" />;
    }

    return (
        <Banner imageUrl={savedEngagement.banner_url} height="480px">
            <EngagementInfoSection savedEngagement={savedEngagement}>{surveyButton}</EngagementInfoSection>
        </Banner>
    );
};
