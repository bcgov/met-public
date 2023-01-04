import { createTheme } from '@mui/material';

export const options = [
    {
        id: 1,
        label: 'Day Zero',
        description: 'Start date is excluded from calculation. ',
    },
    {
        id: 2,
        label: 'Calendar',
        description: 'Start date is included in calculation.',
    },
    {
        id: 3,
        label: 'Suspension',
        description: 'Suspended dates are excluded from calculation.',
    },
];

export const muitheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 450,
            md: 600,
            lg: 1024,
            xl: 1200,
        },
    },
});
