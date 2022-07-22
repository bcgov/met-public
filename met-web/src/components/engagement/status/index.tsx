import React from 'react';
import { Chip } from '@mui/material';
import { SubmissionStatus } from 'constants/engagementStatus';

const Open = () => {
    return <Chip label="Open" color="success" sx={{ fontWeight: 500 }} />;
};

const Closed = () => {
    return <Chip label="Closed" color="error" sx={{ fontWeight: 500 }} />;
};

const Upcoming = () => {
    return <Chip label="Upcoming" sx={{ fontWeight: 500, backgroundColor: '#FFC107', color: 'black' }} />;
};

export const EngagementStatusChip = ({ submissionStatus }: { submissionStatus: SubmissionStatus }) => {
    switch (submissionStatus) {
        case SubmissionStatus.Upcoming:
            // Engagement is published but submission start date is not due yet.
            return <Upcoming />;
        case SubmissionStatus.Open:
            // Engagement is published and open for submission.
            return <Open />;
        case SubmissionStatus.Closed:
            // Engagement is published but it's past the submission date.
            return <Closed />;
        default:
            return null;
    }
};
