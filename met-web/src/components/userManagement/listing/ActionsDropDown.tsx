import React, { useMemo, useContext } from 'react';
import { MenuItem, Select } from '@mui/material';
import { User } from 'models/user';
import { Palette } from 'styles/Theme';
import { UserManagementContext } from './UserManagementContext';
import { USER_GROUP } from 'models/user';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ selectedUser }: { selectedUser: User }) => {
    const { setAddUserModalOpen, setassignRoleModalOpen, setUser } = useContext(UserManagementContext);

    const hasNoRole = (): boolean => {
        if (selectedUser.main_group) {
            return false;
        }
        return true;
    };

    const isAdmin = (): boolean => {
        if (selectedUser?.main_group == USER_GROUP.ADMIN.label) {
            return true;
        }
        return false;
    };

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Assign Role',
                action: () => {
                    {
                        setUser(selectedUser);
                        setassignRoleModalOpen(true);
                    }
                },
                condition: hasNoRole(),
            },
            {
                value: 2,
                label: 'Assign to an Engagement',
                action: () => {
                    {
                        setUser(selectedUser);
                        setAddUserModalOpen(true);
                    }
                },
                condition: !hasNoRole() && !isAdmin(),
            },
        ],
        [selectedUser.id],
    );

    return (
        <Select
            id={`action-drop-down-${selectedUser.id}`}
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
