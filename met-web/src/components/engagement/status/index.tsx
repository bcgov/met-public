import React from 'react';
import { Chip } from '@mui/material';
import { HearingStatus } from 'constants/engagementStatus';

const Open = () => {
    return <Chip label="Open" color="success" sx={{ fontWeight: 500 }} />;
};

const Closed = () => {
    return <Chip label="Closed" color="error" sx={{ fontWeight: 500 }} />;
};

const Upcoming = () => {
    return <Chip label="Upcoming" sx={{ fontWeight: 500, backgroundColor: '#FFC107', color: 'black' }} />;
};

export const EngagementStatusChip = ({ hearingStatus }: { hearingStatus: HearingStatus }) => {
    switch (hearingStatus) {
        case HearingStatus.Upcoming:
            // Engagement is published but hearing start date is not due yet.
            return <Upcoming />;
        case HearingStatus.Open:
            // Engagement is published and open for hearing.
            return <Open />;
        case HearingStatus.Closed:
            // Engagement is published but it's past the hearing date.
            return <Closed />;
        default:
            return null;
    }
};
