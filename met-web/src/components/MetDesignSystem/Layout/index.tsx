import { styled, Box as MuiBox, Theme, useMediaQuery } from '@mui/material';

const desktopOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('md'));
const tabletOrLarger = (theme: Theme) => useMediaQuery(theme.breakpoints.up('sm'));

// A container that decreases its padding on smaller screens
export const ResponsiveContainer = styled(MuiBox)(({ theme }) => {
    if (desktopOrLarger(theme)) {
        return {
            padding: '1.5em 4.0em',
        };
    }
    if (tabletOrLarger(theme)) {
        return {
            padding: '1.5em 2.0em',
        };
    }
    return {
        padding: '1.5em 1.0em',
    };
});

export { Table, TableHead, TableHeadRow, TableHeadCell, TableBody, TableRow, TableCell, TableContainer } from './Table';
