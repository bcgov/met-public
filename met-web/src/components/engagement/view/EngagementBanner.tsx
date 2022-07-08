import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Skeleton } from '@mui/material';
import { Banner } from '../banner/Banner';

export const EngagementBanner = () => {
    const { engagementLoading, savedEngagement } = useContext(ActionContext);
    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="20em" />;
    }

    return <Banner savedEngagement={savedEngagement} />;
};
