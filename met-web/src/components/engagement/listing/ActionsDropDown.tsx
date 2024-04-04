import React, { useMemo, useState } from 'react';
import { USER_ROLES } from 'services/userService/constants';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import { Engagement } from 'models/engagement';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { SubmissionStatus, EngagementStatus } from 'constants/engagementStatus';
import { Palette } from 'styles/Theme';
import { getFormsSheet } from 'services/FormCAC';
import { openNotification } from 'services/notificationService/notificationSlice';
import { formatToUTC } from 'components/common/dateHelper';
import { downloadFile } from 'utils';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ engagement }: { engagement: Engagement }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isExportingCacForms, setIsExportingCacForms] = useState(false);
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
        if (engagement.engagement_status.id !== EngagementStatus.Draft) {
            return true;
        }

        if (engagement.surveys.length === 0) {
            return false;
        }

        return roles.includes(USER_ROLES.VIEW_ALL_SURVEYS) || assignedEngagements.includes(engagement.id);
    };

    const exportCacFormSheet = async () => {
        setIsExportingCacForms(true);
        try {
            const response = await getFormsSheet({ engagement_id: engagement.id });
            downloadFile(response, `cac-${engagement.name}-${formatToUTC(Date())}.csv`);
        } catch (error) {
            dispatch(
                openNotification({ text: 'Error occured while exporting cac form submissions', severity: 'error' }),
            );
        } finally {
            setIsExportingCacForms(false);
        }
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
                label: 'View Report - Public',
                action: () => {
                    navigate(`/engagements/${engagement.id}/dashboard/public`);
                },
                condition:
                    submissionHasBeenOpened &&
                    (roles.includes(USER_ROLES.ACCESS_DASHBOARD) || assignedEngagements.includes(engagement.id)),
            },
            {
                value: 4,
                label: 'View Report - Internal',
                action: () => {
                    navigate(`/engagements/${engagement.id}/dashboard/internal`);
                },
                condition:
                    submissionHasBeenOpened &&
                    roles.includes(USER_ROLES.VIEW_ALL_SURVEY_RESULTS) &&
                    (roles.includes(USER_ROLES.ACCESS_DASHBOARD) || assignedEngagements.includes(engagement.id)),
            },
            {
                value: 5,
                label: 'View All Comments',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/comments`);
                },
                condition:
                    submissionHasBeenOpened &&
                    (roles.includes(USER_ROLES.REVIEW_COMMENTS) ||
                        roles.includes(USER_ROLES.VIEW_APPROVED_COMMENTS) ||
                        assignedEngagements.includes(engagement.id)),
            },
            {
                value: 6,
                label: 'Export Form Sign-Up Data',
                action: () => {
                    exportCacFormSheet();
                },
                condition:
                    roles.includes(USER_ROLES.EXPORT_ALL_CAC_FORM_TO_SHEET) ||
                    (roles.includes(USER_ROLES.EXPORT_CAC_FORM_TO_SHEET) &&
                        assignedEngagements.includes(engagement.id)),
            },
        ],
        [engagement.id],
    );

    if (isExportingCacForms) {
        return <CircularProgress />;
    }

    return (
        <Select
            id={`action-drop-down-${engagement.id}`}
            value={0}
            fullWidth
            size="small"
            sx={{ backgroundColor: 'var(--bcds-surface-background-white)', color: Palette.info.main }}
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
