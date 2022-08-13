import React, { useContext } from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/engagement/banner/Banner';
import { CommentViewContext } from './CommentViewContext';

export const CommentBanner = () => {
    const { isEngagementLoading, engagement } = useContext(CommentViewContext);
    if (isEngagementLoading || !engagement) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return <Banner savedEngagement={engagement} />;
};
