import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import BannerWithImage from './BannerWithImage';
import BannerWithoutImage from './BannerWithoutImage';
import { Skeleton } from '@mui/material';

export const EngagementBanner = () => {
    const { engagementLoading } = useContext(ActionContext);

    const imageExists = true;

    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="20em" />;
    }
    if (imageExists) {
        return <BannerWithImage />;
    }

    return <BannerWithoutImage />;
};
