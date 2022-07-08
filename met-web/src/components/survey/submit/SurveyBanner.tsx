import React from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/engagement/banner/Banner';
import { Engagement } from 'models/engagement';

interface SurveyBannerProps {
    engagement: Engagement;
    engagementLoading: boolean;
}
export const SurveyBanner = ({ engagement, engagementLoading }: SurveyBannerProps) => {
    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="20em" />;
    }

    return <Banner savedEngagement={engagement} />;
};
