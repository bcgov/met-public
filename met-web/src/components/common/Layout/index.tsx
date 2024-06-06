import React from 'react';
import { Box, BoxProps, Theme, useMediaQuery, useTheme } from '@mui/material';

const desktopOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('md'));
const tabletOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('sm'));

// A container that decreases its padding on smaller screens
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    const theme = useTheme();
    const isDesktopOrLarger = desktopOrLarger(theme);
    const isTabletOrLarger = tabletOrLarger(theme);

    const horizontalPadding = isDesktopOrLarger ? '4.0em' : isTabletOrLarger ? '2.0em' : '1.0em';

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
