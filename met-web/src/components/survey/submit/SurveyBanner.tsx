import React from 'react';
import { Banner } from 'components/banner/Banner';
import EngagementInfoSection from 'components/engagement/old-view/EngagementInfoSection';
import { useRouteLoaderData } from 'react-router-dom';

export const SurveyBanner = () => {
    const { engagement } = useRouteLoaderData('survey');

    if (!engagement) return null;

    return (
        <Banner imageUrl={engagement.banner_url} height="480px">
            <EngagementInfoSection savedEngagement={engagement} />
        </Banner>
    );
};
