import React, { useContext } from 'react';
import { ActionContext } from '../ActionContext';
import { useAppSelector } from 'hooks';
import { BannerSection } from './BannerSection';

interface EngagementBannerProps {
    startSurvey: () => void;
}
export const EngagementBanner = ({ startSurvey }: EngagementBannerProps) => {
    const { isEngagementLoading, savedEngagement, mockStatus } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    return (
        <BannerSection
            startSurvey={startSurvey}
            isEngagementLoading={isEngagementLoading}
            savedEngagement={savedEngagement}
            mockStatus={mockStatus}
            isLoggedIn={isLoggedIn}
        />
    );
};
