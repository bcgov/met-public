import React from 'react';
import { AddUserModal } from './AddUserModal';
import { AssignRoleModal } from './AssignRoleModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';
import { ReassignRoleModal } from './ReassignRoleModal';

export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AddUserModal />
            <AssignRoleModal />
            <ReassignRoleModal />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
