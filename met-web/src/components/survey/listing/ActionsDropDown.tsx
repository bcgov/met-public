import React, { useMemo } from 'react';
import { USER_ROLES } from 'services/userService/constants';
import { MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { SubmissionStatus, EngagementStatus } from 'constants/engagementStatus';
import { Palette } from 'styles/Theme';
import { Survey } from 'models/survey';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ survey }: { survey: Survey }) => {
    const navigate = useNavigate();
    const { roles, assignedEngagements } = useAppSelector((state) => state.user);
    const engagement = survey.engagement;
    const engagementId = engagement?.id ?? 0;
    const submissionHasBeenOpened =
        !!engagement && [SubmissionStatus.Open, SubmissionStatus.Closed].includes(engagement.submission_status);
    const isEngagementDraft = !!engagement && engagement.engagement_status.id === EngagementStatus.Draft;

    const canEditSurvey = (): boolean => {
        if (submissionHasBeenOpened) {
            return false;
        }

        if (roles.includes(USER_ROLES.EDIT_ALL_SURVEYS)) {
            return true;
        }

        if (isEngagementDraft && assignedEngagements.includes(engagementId)) {
            return true;
        }

        return false;
    };

    const canViewSurvey = (): boolean => {
        if (!survey.engagement) {
            return false;
        }

        if (submissionHasBeenOpened || roles.includes(USER_ROLES.VIEW_ALL_SURVEYS)) {
            return true;
        }

        return assignedEngagements.includes(engagementId);
    };

    const canViewReport = (): boolean => {
        return (
            submissionHasBeenOpened &&
            (roles.includes(USER_ROLES.ACCESS_DASHBOARD) || assignedEngagements.includes(engagementId))
        );
    };

    const canViewAllComments = (): boolean => {
        return (
            submissionHasBeenOpened &&
            (roles.includes(USER_ROLES.REVIEW_COMMENTS) || assignedEngagements.includes(engagementId))
        );
    };

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Edit Survey',
                action: () => {
                    navigate(`/surveys/${survey.id}/build`);
                },
                condition: canEditSurvey(),
            },
            {
                value: 2,
                label: 'View Survey',
                action: () => {
                    navigate(`/surveys/${survey.id}/submit`);
                },
                condition: canViewSurvey(),
            },
            {
                value: 3,
                label: 'View Report',
                action: () => {
                    navigate(`/engagements/${engagementId}/dashboard`);
                },
                condition: canViewReport(),
            },
            {
                value: 4,
                label: 'View All Comments',
                action: () => {
                    navigate(`/surveys/${survey.id}/comments`);
                },
                condition: canViewAllComments(),
            },
        ],
        [engagementId],
    );

    return (
        <Select
            id={`action-drop-down-${survey.id}`}
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
