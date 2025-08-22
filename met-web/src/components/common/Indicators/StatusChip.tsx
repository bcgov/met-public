import React from 'react';
import { ChipProps as MuiChipProps, Chip as MuiChip, Skeleton, useTheme } from '@mui/material';
import { colors } from '..';
import { SubmissionStatus } from 'constants/engagementStatus';

export interface ChipProps {
    label?: string;
    statusId: SubmissionStatus;
}

type StatusText = 'Open' | 'Upcoming' | 'Closed';

export const getStatusFromStatusId = (statusId: SubmissionStatus): StatusText => {
    switch (statusId) {
        case SubmissionStatus.Open:
            return 'Open';
        case SubmissionStatus.Upcoming:
            return 'Upcoming';
        case SubmissionStatus.Closed:
            return 'Closed';
        default:
            return 'Closed';
    }
};
/**
 * A Chip component that displays the status of an engagement.
 * It uses the SubmissionStatus enum to determine the status and applies appropriate styles.
 * @param {ChipProps} props - Other properties for the chip component.
 * @param {string} [props.label] - Optional custom label for the chip. If not provided, the status text will be used.
 * @param {SubmissionStatus} props.statusId - The status ID of the engagement, used to determine the chip's appearance.
 * @returns A styled MuiChip component with the status label.
 * @example
 * <EngagementStatusChip statusId={SubmissionStatus.Open} />
 * <EngagementStatusChip statusId={SubmissionStatus.Upcoming} label="Upcoming Engagement" />
 */
export const EngagementStatusChip: React.FC<ChipProps & Partial<MuiChipProps>> = ({
    label: customLabel,
    statusId: status,
    ...props
}) => {
    const statusText = getStatusFromStatusId(status);
    const theme = useTheme();
    const invert = theme.palette.mode === 'dark';
    return (
        <MuiChip
            {...props}
            label={customLabel || statusText}
            className={`status-chip status-chip-${statusText.toLowerCase()} ${invert ? 'status-chip-invert' : ''}`}
            sx={{
                display: 'inline-flex',
                height: '28px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                border: '2px solid',
                borderColor: 'transparent',
                borderRadius: '24px',
                boxSizing: 'border-box',
                '&>.MuiChip-label': {
                    padding: '4px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: '16px',
                    position: 'relative',
                    bottom: '1px',
                },
                '&.status-chip-open': {
                    backgroundColor: colors.surface.blue[80],
                    color: colors.type.inverted.primary,
                    '&.status-chip-invert': {
                        backgroundColor: 'transparent',
                        borderColor: colors.surface.white,
                    },
                },
                '&.status-chip-upcoming': {
                    backgroundColor: 'transparent',
                    color: colors.surface.blue[80],
                    borderColor: colors.surface.blue[80],
                    borderStyle: 'dashed',
                    '&.status-chip-invert': {
                        backgroundColor: 'transparent',
                        borderColor: colors.surface.white,
                        color: colors.type.inverted.primary,
                    },
                },
                '&.status-chip-closed': {
                    backgroundColor: colors.surface.gray[90],
                    borderColor: colors.surface.gray[100],
                    color: colors.surface.gray[40],
                },
                ...props.sx,
            }}
        />
    );
};

/**
 * A skeleton component for the StatusChip.
 * It provides a placeholder for the chip while the actual data is loading.
 * @returns A rectangular skeleton with a fixed width and height, styled to resemble a status chip.
 */
export const StatusChipSkeleton = () => (
    <Skeleton variant="rectangular" sx={{ width: '64px', height: '28px', borderRadius: '24px' }} />
);
