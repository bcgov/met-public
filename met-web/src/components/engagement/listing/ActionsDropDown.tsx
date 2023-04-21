import React, { useMemo } from 'react';
import { Engagement } from 'models/engagement';
import { MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
}
export const ActionsDropDown = ({ engagement }: { engagement: Engagement }) => {
    const navigate = useNavigate();

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Edit Engagement',
                action: () => {
                    navigate(`/engagements/${engagement.id}/form`);
                },
            },
            {
                value: 2,
                label: 'View Survey',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/submit`);
                },
            },
            {
                value: 3,
                label: 'View Report',
                action: () => {
                    navigate(`/engagements/${engagement.id}/dashboard`);
                },
            },
            {
                value: 4,
                label: 'View All Comments',
                action: () => {
                    navigate(`/surveys/${engagement.surveys[0].id}/comments`);
                },
            },
        ],
        [engagement.id],
    );
    return (
        <Select id={`action-drop-down-${engagement.id}`} value={0} fullWidth>
            <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                {''}
            </MenuItem>
            {ITEMS.map((item) => (
                <MenuItem key={item.value} value={item.value} onClick={item.action}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );
};
