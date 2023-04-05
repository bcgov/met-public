import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export interface ProgressBarProps {
    currentPage: number;
    totalPages: number;
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
            <Box sx={{ width: '100%', mr: 1, p: 3 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
        </Box>
    );
}

export default function ProgressBar({ currentPage, totalPages }: ProgressBarProps) {
    const progress = (currentPage / totalPages) * 100;

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}
