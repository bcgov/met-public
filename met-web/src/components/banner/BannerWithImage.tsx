import React, { useState } from 'react';
import { Box } from '@mui/material';
import BannerWithoutImage from './BannerWithoutImage';
import { BannerProps } from '../engagement/view/types';

const BannerWithImage = ({ imageUrl, children }: BannerProps) => {
    const [imageError, setImageError] = useState(false);

    if (!imageUrl || imageError) {
        return <BannerWithoutImage>{children}</BannerWithoutImage>;
    }

    return (
        <>
            <Box
                sx={{
                    height: '38em',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <img
                    src={imageUrl}
                    style={{
                        objectFit: 'cover',
                        height: '38em',
                        width: '100%',
                    }}
                    onError={(_e) => {
                        setImageError(true);
                    }}
                />
                {children}
            </Box>
        </>
    );
};

export default BannerWithImage;
