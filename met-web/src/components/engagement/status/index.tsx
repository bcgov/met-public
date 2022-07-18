import React from 'react';
import { Chip } from '@mui/material';
import { EngagementStatus } from 'constants/engagementStatus';

const Open = () => {
    return <Chip label="Open" color="success" sx={{ fontWeight: 500 }} />;
};

const Closed = () => {
    return <Chip label="Closed" color="error" sx={{ fontWeight: 500 }} />;
};

const Upcoming = () => {
    return <Chip label="Upcoming" sx={{ fontWeight: 500, backgroundColor: '#FFC107', color: 'black' }} />;
};

export const EngagementStatusChip = ({ status_id }: { status_id: EngagementStatus }) => {
    switch (status_id) {
        case EngagementStatus.Draft:
            return <Upcoming />;
        case EngagementStatus.Published:
            return <Open />;
        case EngagementStatus.Closed:
            return <Closed />;
        default:
            return null;
    }
};
