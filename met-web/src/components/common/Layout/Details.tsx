import { Box, BoxProps } from '@mui/material';
import React from 'react';
import { colors } from '..';

/**
 * A container component for displaying details in a layout.
 * It is designed to be used for displaying detailed information in a structured format.
 * The component supports additional styling through the `sx` prop.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display within the details container.
 * @param {BoxProps} [props.formContainerProps] - Additional properties for the Box component.
 * @returns {JSX.Element} A styled Box component that serves as a details container.
 * @example
 * <DetailsContainer>
 *    <Detail>Detail 1</Detail>
 *    <Detail>Detail 2</Detail>
 * </DetailsContainer>
 * */
export const DetailsContainer = ({ children, ...formContainerProps }: { children: React.ReactNode } & BoxProps) => {
    const { sx, ...rest } = formContainerProps;
    return (
        <Box
            className="met-layout-details-container"
            sx={{
                display: 'flex',
                padding: { xs: '16px', sm: '32px' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: colors.surface.gray[10],
                gap: '24px',
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

/**
 * A component that displays a detail section within a layout.
 * It is designed to be used for displaying detailed information in a structured format.
 * The component supports an optional `invisible` prop to control whether the background is visible or transparent.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display within the detail section.
 * @param {boolean} [props.invisible=false] - If true, the background will be transparent; otherwise, it will be white.
 * @param {BoxProps} [props.containerProps] - Additional properties for the Box component.
 * @returns {JSX.Element} A styled Box component that serves as a detail section.
 * @example
 * <Detail invisible={false}>
 *     <h2>Detail Title</h2>
 *     <p>This is some detailed information.</p>
 * </Detail>
 */
export const Detail = ({
    children,
    invisible,
    ...containerProps
}: { children: React.ReactNode; invisible?: boolean } & BoxProps) => {
    const { sx, ...rest } = containerProps;
    return (
        <Box
            className="met-layout-detail"
            sx={{
                display: 'flex',
                padding: '16px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '4px',
                background: invisible ? 'transparent' : colors.surface.white,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};
