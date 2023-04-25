import React, { useMemo } from 'react';
import { USER_ROLES } from 'services/userService/constants';
import { MenuItem, Select } from '@mui/material';
import { Engagement } from 'models/engagement';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { SubmissionStatus, EngagementStatus } from 'constants/engagementStatus';
import { Palette } from 'styles/Theme';

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
    const isDraft = engagement.engagement_status.id === EngagementStatus.Draft;
    const isOpen = engagement.submission_status === SubmissionStatus.Open;
    const isClosed = engagement.submission_status === SubmissionStatus.Closed;
    const isUpcoming =
        engagement.engagement_status.id === EngagementStatus.Published &&
        engagement.submission_status === SubmissionStatus.Upcoming;
    const isScheduled = engagement.engagement_status.id === EngagementStatus.Scheduled;

    const canEditEngagement = (): boolean => {
        const authorized = roles.includes(USER_ROLES.EDIT_ENGAGEMENT) || assignedEngagements.includes(engagement.id);

        if (!authorized) {
            return false;
        }

        if (isDraft) {
            const canEditDraftEngagement = roles.includes(USER_ROLES.EDIT_DRAFT_ENGAGEMENT);
            return canEditDraftEngagement;
        }
        if (isOpen) {
            const canEditOpenEngagement = roles.includes(USER_ROLES.EDIT_OPEN_ENGAGEMENT);
            return canEditOpenEngagement;
        }
        if (isClosed) {
            const canEditClosedEngagement = roles.includes(USER_ROLES.EDIT_CLOSED_ENGAGEMENT);
            return canEditClosedEngagement;
        }
        if (isScheduled) {
            const canEditScheduledEngagement = roles.includes(USER_ROLES.EDIT_SCHEDULED_ENGAGEMENT);
            return canEditScheduledEngagement;
        }
        if (isUpcoming) {
            const canEditUpcomingEngagement = roles.includes(USER_ROLES.EDIT_UPCOMING_ENGAGEMENT);
            return canEditUpcomingEngagement;
        }
        return true;
    };

    const canViewSurvey = (): boolean => {
        if (engagement.engagement_status.id === EngagementStatus.Draft) {
            return roles.includes(USER_ROLES.VIEW_ALL_SURVEYS) || assignedEngagements.includes(engagement.id);
        }

        return true;
    };

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Edit Engagement',
                action: () => {
                    navigate(`/engagements/${engagement.id}/form`);
                },
                condition: canEditEngagement(),
            },
            {
                value: 2,
                label: 'View Survey',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/submit`);
                },
                condition: canViewSurvey(),
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
        <Select
            id={`action-drop-down-${engagement.id}`}
            value={0}
            fullWidth
            size="small"
            sx={{ backgroundColor: 'white', color: Palette.info.main }}
        >
            <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }} color="info" disabled>
                {'(Select One)'}
            </MenuItem>
            {ITEMS.filter((item) => item.condition).map((item) => (
                <MenuItem key={item.value} value={item.value} onClick={item.action}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );
};
