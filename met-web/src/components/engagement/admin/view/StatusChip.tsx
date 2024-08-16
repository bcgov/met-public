import React from 'react';
import { Chip, Box } from '@mui/material';
import { useAsyncValue } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';

export const StatusChip = ({
    status,
    children,
}: {
    status: 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
}) => {
    return (
        <Chip
            label={children}
            sx={{
                backgroundColor: `notification.${status}.shade`,
                color: 'primary.contrastText',
                borderRadius: '8px',
            }}
        />
    );
};

export const AutoEngagementStatusChip = () => {
    const engagement = useAsyncValue() as Engagement;
    const statusName = EngagementStatus[engagement?.status_id];
    let status = 'danger' as 'success' | 'warning' | 'danger' | 'info';
    if (statusName === 'Scheduled') {
        status = 'info';
    } else if (statusName === 'Published') {
        status = 'success';
    }
    return <StatusChip status={status}>{engagement?.status_id}</StatusChip>;
};
