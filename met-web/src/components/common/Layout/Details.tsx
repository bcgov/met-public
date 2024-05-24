import { Box, BoxProps } from '@mui/material';
import React from 'react';
import { colors } from '..';

export const DetailsContainer = ({ children, ...formContainerProps }: { children: React.ReactNode } & BoxProps) => {
    const { sx, ...rest } = formContainerProps;
    return (
        <Box
            className="met-layout-details-container"
            sx={{
                display: 'flex',
                padding: { xs: '16px', sm: '32px' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: colors.surface.gray[10],
                gap: '24px',
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};
export const Detail = ({
    children,
    invisible,
    ...containerProps
}: { children: React.ReactNode; invisible?: boolean } & BoxProps) => {
    const { sx, ...rest } = containerProps;
    return (
        <Box
            className="met-layout-detail"
            sx={{
                display: 'flex',
                padding: '16px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '4px',
                background: invisible ? 'transparent' : colors.surface.white,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};
