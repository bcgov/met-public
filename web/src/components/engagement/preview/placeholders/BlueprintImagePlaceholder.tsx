import React from 'react';
import { Box } from '@mui/material';
import { colors } from 'styles/Theme';
import { BodyText } from 'components/common/Typography';

interface BlueprintImagePlaceholderProps {
    height?: string | number;
    title?: string;
    description?: string;
}

/**
 * Blueprint-style placeholder for missing images in preview mode.
 * Shows an X corner-to-corner and explanatory text.
 */
export const BlueprintImagePlaceholder: React.FC<BlueprintImagePlaceholderProps> = ({
    height = '500px',
    title = 'Image Placeholder',
    description = 'Upload an image to see it here',
}) => {
    return (
        <Box
            sx={{
                height,
                pointerEvents: 'none',
                zIndex: -2,
                width: '100%',
                bgcolor: colors.surface.blue[20],
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            {/* X corner-to-corner using SVG to create correct diagonal lines */}
            <Box
                component="svg"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Diagonal line from top-left to bottom-right */}
                <line
                    x1="0"
                    y1="0"
                    x2="100"
                    y2="100"
                    stroke={colors.surface.blue[60]}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
                {/* Diagonal line from top-right to bottom-left */}
                <line
                    x1="100"
                    y1="0"
                    x2="0"
                    y2="100"
                    stroke={colors.surface.blue[60]}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            </Box>
            {/* Explanatory text */}
            <Box
                sx={{
                    marginLeft: { xs: '0', md: '720px' }, // to avoid overlapping with hero content on larger screens
                    textAlign: 'center',
                    padding: 4,
                    maxWidth: '600px',
                    textWrap: 'nowrap',
                    writingMode: { xs: 'horizontal-tb', md: 'sideways-lr', lg: 'horizontal-tb' },
                }}
            >
                <BodyText sx={{ color: 'blue.80', mb: 1, fontSize: '24px' }}>{title}</BodyText>
                <BodyText sx={{ color: 'blue.80' }}>{description}</BodyText>
            </Box>
        </Box>
    );
};

export default BlueprintImagePlaceholder;
