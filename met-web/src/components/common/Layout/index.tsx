import React from 'react';
import { Box, BoxProps, Theme, useMediaQuery, useTheme } from '@mui/material';

const useDesktopOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('md'));
const useTabletOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('sm'));

// A container that decreases its padding on smaller screens
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    const theme = useTheme();
    const isDesktopOrLarger = useDesktopOrLarger(theme);
    const isTabletOrLarger = useTabletOrLarger(theme);

    let horizontalPadding;
    if (isDesktopOrLarger) {
        horizontalPadding = '4.0em';
    } else {
        if (isTabletOrLarger) {
            horizontalPadding = '2.0em';
        } else {
            horizontalPadding = '1.0em';
        }
    }

    return (
        <Box
            sx={{
                padding: `1.5em ${horizontalPadding}`,
            }}
            {...props}
        >
            {props.children}
        </Box>
    );
};

export { Table, TableHead, TableHeadRow, TableHeadCell, TableBody, TableRow, TableCell, TableContainer } from './Table';
export { DetailsContainer, Detail } from './Details';
