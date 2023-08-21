import React, { useMemo } from 'react';
import { USER_ROLES } from 'services/userService/constants';
import { MenuItem, Select } from '@mui/material';
import { Feedback } from 'models/feedback';
import { useAppSelector } from 'hooks';
import { Palette } from 'styles/Theme';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ feedback }: { feedback: Feedback }) => {
    const { roles } = useAppSelector((state) => state.user);

    const canEditFeedback = (): boolean => {
        const authorized = roles.includes(USER_ROLES.APP_ADMIN);

        if (!authorized) {
            return false;
        }

        return true;
    };

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Delete Feedback',
                action: () => {
                    //Delete function for feedback
                },
                condition: canEditFeedback(),
            },
            {
                value: 2,
                label: 'Archive Feedback',
                action: () => {
                    //Archive said feedback
                },
                condition: canEditFeedback(),
            },
        ],
        [feedback.id],
    );

    return (
        <Select
            id={`action-drop-down-${feedback.id}`}
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
