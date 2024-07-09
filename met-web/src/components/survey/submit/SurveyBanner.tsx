import React from 'react';
import { Banner } from 'components/banner/Banner';
import EngagementInfoSection from 'components/engagement/view/EngagementInfoSection';
import { Engagement } from 'models/engagement';
import { useAsyncValue } from 'react-router-dom';

export const SurveyBanner = () => {
    const engagement = useAsyncValue() as Engagement | undefined;

    if (!engagement) return null;

    return (
        <Banner imageUrl={engagement.banner_url} height="480px">
            <EngagementInfoSection savedEngagement={engagement} />
        </Banner>
    );
};
