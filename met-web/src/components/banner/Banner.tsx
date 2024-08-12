import React from 'react';
import BannerWithImage from './BannerWithImage';
import { BannerProps } from '../engagement/old-view/types';

export const Banner = ({ height, imageUrl, children }: BannerProps) => {
    return (
        <BannerWithImage height={height} imageUrl={imageUrl}>
            {children}
        </BannerWithImage>
    );
};
