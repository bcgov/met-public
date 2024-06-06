import React from 'react';
import { Box, BoxProps, Theme, useMediaQuery, useTheme } from '@mui/material';

const useDesktopOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('md'));
const useTabletOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('sm'));

// A container that decreases its padding on smaller screens
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    const theme = useTheme();

    const useHorizontalPadding = () => {
        if (useDesktopOrLarger(theme)) {
            return '2em';
        } else if (useTabletOrLarger(theme)) {
            return '1.5em';
        } else {
            return '1em';
        }
    };

    return (
        <Box
            sx={{
                padding: `1.5em ${useHorizontalPadding()}`,
            }}
            {...props}
        >
            {props.children}
        </Box>
    );
};

export { Table, TableHead, TableHeadRow, TableHeadCell, TableBody, TableRow, TableCell, TableContainer } from './Table';
export { DetailsContainer, Detail } from './Details';
