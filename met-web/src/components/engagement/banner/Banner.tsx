import React from 'react';
import BannerWithImage from './BannerWithImage';
import BannerWithoutImage from './BannerWithoutImage';
import { BannerProps } from '../view/types';

export const Banner = ({ savedEngagement, children }: BannerProps) => {
    const imageExists = !!savedEngagement.banner_url;

    if (imageExists) {
        return <BannerWithImage savedEngagement={savedEngagement}>{children}</BannerWithImage>;
    }

    return <BannerWithoutImage savedEngagement={savedEngagement} />;
};
