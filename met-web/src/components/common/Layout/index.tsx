import React from 'react';
import { Box, BoxProps, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';

// A container that decreases its padding on smaller screens
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

export const OutlineBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.contrastText,
    outline: `1px solid ${theme.palette.primary.light}`,
    padding: '1em 1.5em',
    borderRadius: '8px',
}));

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
