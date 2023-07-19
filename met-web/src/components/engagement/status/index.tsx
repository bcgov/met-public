import React from 'react';
import { Chip } from '@mui/material';
import { SubmissionStatus } from 'constants/engagementStatus';
const Chip_Font_Weight = { fontWeight: 'bold' };

interface ChipParams {
    active: boolean;
    clickable: boolean;
}
const Open = ({ active, clickable }: ChipParams) => {
    return (
        <Chip
            label="Open"
            color={active ? 'success' : 'default'}
            sx={[{ ...Chip_Font_Weight }, clickable && { cursor: 'pointer' }]}
        />
    );
};

const Closed = ({ active, clickable }: ChipParams) => {
    return (
        <Chip
            label="Closed"
            color={active ? 'error' : 'default'}
            sx={[{ ...Chip_Font_Weight }, clickable && { cursor: 'pointer' }]}
        />
    );
};

const Upcoming = ({ active, clickable }: ChipParams) => {
    return (
        <Chip
            label="Upcoming"
            sx={[
                { ...Chip_Font_Weight },
                active && { backgroundColor: '#FFC107', color: 'black' },
                clickable && { cursor: 'pointer' },
            ]}
        />
    );
};

export const EngagementStatusChip = ({
    submissionStatus,
    active = true,
    clickable = false,
}: {
    submissionStatus: SubmissionStatus;
    active?: boolean;
    clickable?: boolean;
}) => {
    switch (submissionStatus) {
        case SubmissionStatus.Upcoming:
            // Engagement is published but submission start date is not due yet.
            return <Upcoming active={active} clickable={clickable} />;
        case SubmissionStatus.Open:
            // Engagement is published and open for submission.
            return <Open active={active} clickable={clickable} />;
        case SubmissionStatus.Closed:
            // Engagement is published but it's past the submission date.
            return <Closed active={active} clickable={clickable} />;
        default:
            return null;
    }
};
