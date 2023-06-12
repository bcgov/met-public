import React, { useMemo, useContext } from 'react';
import { MenuItem, Select } from '@mui/material';
import { User } from 'models/user';
import { Palette } from 'styles/Theme';
import { AssignRoleModal } from './AssignRoleModal';
import { UserManagementContext } from './UserManagementContext';

interface ActionDropDownItem {
    value: number;
    label: string;
    action?: () => void;
    condition?: boolean;
}
export const ActionsDropDown = ({ selectedUser }: { selectedUser: User }) => {
    const { assignRoleModalOpen, setassignRoleModalOpen, setUser } = useContext(UserManagementContext);

    const handleClose = () => {
        setassignRoleModalOpen(true);
    };

    const hasNoRole = (): boolean => {
        if (selectedUser.main_role) {
            return false;
        }
        return true;
    };

    const ITEMS: ActionDropDownItem[] = useMemo(
        () => [
            {
                value: 1,
                label: 'Assign Role',
                action: () => {
                    {
                        setUser(selectedUser);
                        assignRoleModalOpen ? <AssignRoleModal /> : null;
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
                        assignRoleModalOpen ? <AssignRoleModal /> : null;
                    }
                },
                condition: !hasNoRole(),
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
            onChange={handleClose}
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
