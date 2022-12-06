import React, { ReactNode } from 'react';
import { Box } from '@mui/system';

export const ReadMoreBox = ({ children, ...rest }: { children: ReactNode; [prop: string]: unknown }) => {
    return (
        <Box padding={'2em'} maxWidth={'30em'} {...rest}>
            {children}
        </Box>
    );
};
