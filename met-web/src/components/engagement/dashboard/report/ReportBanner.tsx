import React, { useContext } from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/engagement/banner/Banner';
import { Engagement } from 'models/engagement';

interface ReportBannerProps {
    engagement: Engagement;
    isLoading: boolean;
}
export const ReportBanner = ({ engagement, isLoading }: ReportBannerProps) => {
    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return <Banner savedEngagement={engagement} />;
};
