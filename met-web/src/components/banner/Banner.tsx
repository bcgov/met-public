import React from 'react';
import BannerWithImage from './BannerWithImage';
import { BannerProps } from '../engagement/view/types';

export const Banner = ({ imageUrl, children }: BannerProps) => {
    return <BannerWithImage imageUrl={imageUrl}>{children}</BannerWithImage>;
};
