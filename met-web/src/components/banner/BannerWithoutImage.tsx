import React from 'react';
import { Box } from '@mui/material';
import { BannerProps } from '../engagement/view/types';

const BannerWithoutImage = ({ children }: BannerProps) => {
    return (
        <Box
            sx={{
                // backgroundColor: isDraft ? '#707070' : '#F2F2F2',
                backgroundColor: '#F2F2F2',
                width: '100%',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    height: '20em',
                    width: '100%',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default BannerWithoutImage;
