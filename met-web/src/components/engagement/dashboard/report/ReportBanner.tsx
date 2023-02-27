import React from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { Engagement } from 'models/engagement';
import EngagementInfoSection from 'components/engagement/view/EngagementInfoSection';

interface ReportBannerProps {
    engagement: Engagement;
    isLoading: boolean;
}
export const ReportBanner = ({ engagement, isLoading }: ReportBannerProps) => {
    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner imageUrl={engagement.banner_url}>
            <EngagementInfoSection savedEngagement={engagement} />
        </Banner>
    );
};
