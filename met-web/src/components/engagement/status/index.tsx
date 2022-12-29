import React from 'react';
import { Chip } from '@mui/material';
import { SubmissionStatus } from 'constants/engagementStatus';

const Chip_Font_Weight = { fontWeight: 'bold' };

const Open = ({ preview }: { preview?: boolean }) => {
    return <Chip label="Open" color={preview ? 'default' : 'success'} sx={{ ...Chip_Font_Weight }} />;
};

const Closed = ({ preview }: { preview?: boolean }) => {
    return <Chip label="Closed" color={preview ? 'default' : 'error'} sx={{ ...Chip_Font_Weight }} />;
};

const Upcoming = ({ preview }: { preview?: boolean }) => {
    return (
        <Chip
            label="Upcoming"
            sx={preview ? { ...Chip_Font_Weight } : { ...Chip_Font_Weight, backgroundColor: '#FFC107', color: 'black' }}
        />
    );
};

export const EngagementStatusChip = ({
    submissionStatus,
    preview,
}: {
    submissionStatus: SubmissionStatus;
    preview?: boolean | undefined;
}) => {
    switch (submissionStatus) {
        case SubmissionStatus.Upcoming:
            // Engagement is published but submission start date is not due yet.
            return <Upcoming preview={preview} />;
        case SubmissionStatus.Open:
            // Engagement is published and open for submission.
            return <Open preview={preview} />;
        case SubmissionStatus.Closed:
            // Engagement is published but it's past the submission date.
            return <Closed preview={preview} />;
        default:
            return null;
    }
};
