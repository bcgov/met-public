import React, { useContext } from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { CommentViewContext } from './CommentViewContext';
import EngagementInfoSection from 'components/engagement/view/EngagementInfoSection';

export const CommentBanner = () => {
    const { isEngagementLoading, engagement } = useContext(CommentViewContext);
    if (isEngagementLoading || !engagement) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner imageUrl={engagement.banner_url}>
            <EngagementInfoSection savedEngagement={engagement} />
        </Banner>
    );
};
