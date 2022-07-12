import React from 'react';
import BannerWithImage from './BannerWithImage';
import BannerWithoutImage from './BannerWithoutImage';
import { EngagementBannerProps } from '../view/types';

export const Banner = ({ savedEngagement, children }: EngagementBannerProps) => {
    const imageExists = false;

    if (imageExists) {
        return <BannerWithImage savedEngagement={savedEngagement}>{children}</BannerWithImage>;
    }

    return <BannerWithoutImage savedEngagement={savedEngagement} />;
};
