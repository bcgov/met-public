import React, { useMemo } from 'react';
import { MenuItem, Select } from '@mui/material';
import { Palette } from 'styles/Theme';
import { ENGAGEMENT_MEMBERSHIP_STATUS, EngagementTeamMember } from 'models/engagementTeamMember';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ membership }: { membership: EngagementTeamMember }) => {
    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Revoke',
                action: () => {
                    {
                    }
                },
                condition: membership.status !== ENGAGEMENT_MEMBERSHIP_STATUS.Revoked,
            },
        ],
        [membership.id],
    );

    return (
        <Select
            id={`action-drop-down-${membership.id}`}
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
