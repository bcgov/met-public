import React from 'react';
import { Box } from '@mui/material';
import { Palette } from 'styles/Theme';

export const ApprovedIcon = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: '1.4em',
                minWidth: '1.4em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#D3FDC6',
                borderRadius: '3px',
                fontWeight: 'bold',
            }}
        >
            {children}
        </Box>
    );
};

export const PendingIcon = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: '1.4em',
                minWidth: '1.4em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FCE0B9',
                borderRadius: '3px',
                fontWeight: 'bold',
            }}
        >
            {children}
        </Box>
    );
};

export const RejectedIcon = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: '1.4em',
                minWidth: '1.4em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F9D9D9',
                borderRadius: '3px',
                fontWeight: 'bold',
            }}
        >
            {children}
        </Box>
    );
};

export const NewIcon = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: '1.4em',
                minWidth: '1.4em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '3px',
                fontWeight: 'bold',
                border: `2px solid ${Palette.primary.main}`,
            }}
            borderColor="inherit"
        >
            {children}
        </Box>
    );
};
