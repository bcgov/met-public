import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { Outlet } from 'react-router';

/**
 * A styled Box component that pads and outlines its content with the primary color of the theme.
 * Used to create visually distinct sections in the UI.
 */
export const OutlineBox = (props: BoxProps) => {
    return (
        <Box
            {...props}
            sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.primary.contrastText,
                outline: (theme) => `1px solid ${theme.palette.primary.light}`,
                padding: '1em 1.5em',
                borderRadius: '8px',
                ...props.sx,
            }}
        >
            {props.children}
        </Box>
    );
};

/**
 * A responsive container component that decreases its side padding on smaller screens.
 * The side padding is set to 1em on small screens, 1.5em on medium screens, and 3em on large screens.
 * @param props - The props to pass to the Box component.
 *                It accepts all BoxProps from MUI, including children, sx, etc.
 * @returns JSX.Element: A Box component with responsive padding.
 */
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    return (
        <Box
            {...props}
            sx={{
                padding: { xs: '3em 1em', md: '3em 1.5em', lg: '3em 3em' },
                ...props.sx,
            }}
        >
            {props.children}
        </Box>
    );
};

/**
 * A route wrapper that adds a responsive container around its child routes.
 * This component is used to ensure that all routes within it are displayed with consistent padding and styling.
 * Do not use further ResponsiveContainer components inside this wrapper.
 */
export const ResponsiveWrapper: React.FC = () => {
    return (
        <ResponsiveContainer>
            <Outlet />
        </ResponsiveContainer>
    );
};

export { Table, TableHead, TableHeadRow, TableHeadCell, TableBody, TableRow, TableCell, TableContainer } from './Table';
export { DetailsContainer, Detail } from './Details';
