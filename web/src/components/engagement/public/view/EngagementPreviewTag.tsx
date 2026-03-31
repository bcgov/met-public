import React from 'react';
import { Grid2 as Grid, Grid2Props as GridProps } from '@mui/material';
import { usePreview } from 'engagements/preview/PreviewContext';

interface PreviewTagProps extends GridProps {
    required?: boolean;
}

/**
 * A tag component that displays a label on the side of the screen to indicate the current section in preview mode.
 * It is only visible when in preview mode and is positioned absolutely on the right side of the screen.
 * The text is oriented vertically to save space and provide a clear indication of the section being previewed.
 * @param {PreviewTagProps} props - The component props.
 * @param {PreviewTagProps['required']} [props.required] - If true, indicates that the section is required and styles the tag with a red background. Defaults to false (gray background).
 * @param {PreviewTagProps['children']} props.children - The content to display within the tag, typically the name of the section.
 * @param {PreviewTagProps['sx']} [props.sx] - Additional styles to apply to the Box component.
 * @returns {JSX.Element|null} A styled Box component with vertical text, or null if not in preview mode.
 * @example
 * <EngagementPreviewTag required>Hero Banner Section</EngagementPreviewTag>
 */
export const EngagementPreviewTag: React.FC<PreviewTagProps> = ({ children, required, sx, ...props }) => {
    const { isPreviewMode } = usePreview();
    if (!isPreviewMode) {
        return null;
    }
    return (
        // Container Grid positioned absolutely on the right side of the nearest positioned ancestor
        <Grid
            container
            spacing={2}
            direction="column"
            position="absolute"
            right="0"
            zIndex={100}
            justifyContent="center"
            height="100%"
            sx={{ pointerEvents: 'none' }} // Ensure the container does not interfere with interactions
        >
            {/* Centers its content vertically so the tag is always in the middle of its section */}
            <Grid
                bgcolor={required ? '#C00000' : 'gray.80'}
                color="white"
                boxShadow={20}
                padding="40px 14px 40px 11px"
                lineHeight="24px"
                textAlign="center"
                borderRadius="8px 0 0 8px"
                boxSizing="border-box"
                {...props}
                sx={[
                    {
                        textOrientation: 'sideways-right',
                        writingMode: 'sideways-lr',
                        transition: 'opacity 0.3s',
                        opacity: { xs: 0.7, md: 1 }, // Slightly transparent on smaller screens to reduce visual clutter, fully opaque on larger screens
                        pointerEvents: 'none', // Ensure the tag does not interfere with interactions
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                {children}
            </Grid>
        </Grid>
    );
};
