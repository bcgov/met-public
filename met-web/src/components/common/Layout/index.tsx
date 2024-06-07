import React from 'react';
import { Box, BoxProps, Theme, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

const useDesktopOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('md'));
const useTabletOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('sm'));

// A container that decreases its padding on smaller screens
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    const theme = useTheme();
    const isDesktopOrLarger = useDesktopOrLarger(theme);
    const isTabletOrLarger = useTabletOrLarger(theme);

    const horizontalPadding = () => {
        if (isDesktopOrLarger) {
            return '2em';
        } else if (isTabletOrLarger) {
            return '1.5em';
        } else {
            return '1em';
        }
    };

    return (
        <Box
            sx={{
                padding: `1.5em ${horizontalPadding()}`,
            }}
            {...props}
        >
            {props.children}
        </Box>
    );
};

/**
 * A route wrapper that adds a responsive container around its child routes.
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
