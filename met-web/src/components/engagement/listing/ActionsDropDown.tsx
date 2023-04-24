import React, { useMemo } from 'react';
import { USER_ROLES } from 'services/userService/constants';
import { MenuItem, Select } from '@mui/material';
import { Engagement } from 'models/engagement';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { SubmissionStatus } from 'constants/engagementStatus';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ engagement }: { engagement: Engagement }) => {
    const navigate = useNavigate();
    const { roles, assignedEngagements } = useAppSelector((state) => state.user);
    const submissionHasBeenOpened = [SubmissionStatus.Open, SubmissionStatus.Closed].includes(
        engagement.submission_status,
    );

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Edit Engagement',
                action: () => {
                    navigate(`/engagements/${engagement.id}/form`);
                },
                condition:
                    !submissionHasBeenOpened &&
                    (roles.includes(USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS) ||
                        assignedEngagements.includes(engagement.id)),
            },
            {
                value: 2,
                label: 'View Survey',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/submit`);
                },
                condition: roles.includes(USER_ROLES.VIEW_ALL_SURVEYS) || assignedEngagements.includes(engagement.id),
            },
            {
                value: 3,
                label: 'View Report',
                action: () => {
                    navigate(`/engagements/${engagement.id}/dashboard`);
                },
                condition:
                    submissionHasBeenOpened &&
                    (roles.includes(USER_ROLES.ACCESS_DASHBOARD) || assignedEngagements.includes(engagement.id)),
            },
            {
                value: 4,
                label: 'View All Comments',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/comments`);
                },
                condition:
                    submissionHasBeenOpened &&
                    (roles.includes(USER_ROLES.REVIEW_COMMENTS) || assignedEngagements.includes(engagement.id)),
            },
        ],
        [engagement.id],
    );

    return (
        <Select id={`action-drop-down-${engagement.id}`} value={0} fullWidth>
            <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                {''}
            </MenuItem>
            {ITEMS.filter((item) => item.condition).map((item) => (
                <MenuItem key={item.value} value={item.value} onClick={item.action}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );
};
