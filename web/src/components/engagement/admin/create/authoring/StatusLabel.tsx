import React from 'react';
import { EngagementStatus } from 'constants/engagementStatus';
import { StatusLabelProps } from './types';
import { BodyText } from 'components/common/Typography/Body';
import { colors } from 'styles/Theme';

export const StatusLabel = ({ text, completed, status }: StatusLabelProps) => {
    const getStatusColor = (status: EngagementStatus | undefined, completed: boolean | undefined) => {
        if (completed !== undefined) {
            return completed ? colors.notification.success.shade : colors.notification.error.shade;
        }
        switch (status) {
            case EngagementStatus.Draft:
                return colors.notification.error.shade;
            case EngagementStatus.Published:
                return colors.notification.success.shade;
            case EngagementStatus.Scheduled:
                return colors.notification.info.shade;
            case EngagementStatus.Unpublished:
                return colors.surface.gray[80];
            case EngagementStatus.Closed:
                return colors.surface.gray[90];
            default:
                return colors.surface.gray[80]; // default color for unknown statuses
        }
    };

    const getLabelText = (status: EngagementStatus | undefined, completed: boolean | undefined) => {
        if (text) return text;
        if (status !== undefined) return EngagementStatus[status];
        if (completed !== undefined) return completed ? 'Completed' : 'Incomplete';
        return 'Unknown Status';
    };

    const labelColor = getStatusColor(status, completed);
    const labelText = getLabelText(status, completed);
    return (
        <BodyText
            size="small"
            p="0.2rem 0.75rem"
            bgcolor={labelColor}
            color="white"
            borderRadius="3px"
            fontSize="0.8rem"
            display="inline"
            lineHeight="unset"
        >
            {labelText}
        </BodyText>
    );
};
