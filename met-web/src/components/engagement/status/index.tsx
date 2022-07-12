import React from 'react';
import { Chip } from '@mui/material';

const Open = () => {
    return <Chip label="Open" color="success" sx={{ fontWeight: 500 }} />;
};

const Closed = () => {
    return <Chip label="Closed" color="error" sx={{ fontWeight: 500 }} />;
};

const Upcoming = () => {
    return <Chip label="Upcoming" sx={{ fontWeight: 500, backgroundColor: '#FFC107', color: 'black' }} />;
};

export const EngagementStatusChip = ({ status }: { status: string }) => {
    switch (status) {
        case 'Draft':
            return <Upcoming />;
        case 'Open':
            return <Open />;
        case 'Closed':
            return <Closed />;
        default:
            return null;
    }
};
