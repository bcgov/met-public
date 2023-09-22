import React, { useEffect, useState } from 'react';
import { BannerSection } from './BannerSection';
import { Engagement } from 'models/engagement';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { getEngagement } from 'services/engagementService';

interface EngagementBannerProps {
    startSurvey: () => void;
    engagementSlug: string;
}
export const EngagementBanner = ({ startSurvey, engagementSlug }: EngagementBannerProps) => {
    const [isEngagementLoading, setIsEngagementLoading] = useState(true);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);
    const [engagementId, setEngagementId] = useState<number | null>(null);
    const [isError, setIsError] = useState(false);

    const loadEngagementSlug = async () => {
        try {
            const response = await getEngagementIdBySlug(engagementSlug);
            setEngagementId(response.engagement_id);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    const loadEngagement = async () => {
        if (!engagementId) return;
        try {
            const engagement = await getEngagement(engagementId);
            setSavedEngagement(engagement);
            setIsEngagementLoading(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        loadEngagementSlug();
    }, [engagementSlug]);

    useEffect(() => {
        if (engagementId) {
            loadEngagement();
        }
    }, [engagementId]);

    if (isError) {
        return null;
    }

    return (
        <BannerSection
            startSurvey={startSurvey}
            isEngagementLoading={isEngagementLoading}
            savedEngagement={savedEngagement}
            isLoggedIn={false}
        />
    );
};
