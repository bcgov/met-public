import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

// A container that decreases its padding on smaller screens
export const ResponsiveContainer: React.FC<BoxProps> = (props: BoxProps) => {
    return (
        <Box
            {...props}
            sx={{
                marginTop: '1em',
                padding: { xs: '1.5em 1em', md: '1.5em 1.5em', lg: '1.5em 2em' },
                ...props.sx,
            }}
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
