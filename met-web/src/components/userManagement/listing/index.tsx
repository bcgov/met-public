import React from 'react';
import { AddUserModal } from './AddUserModal';
import { AssignRoleModal } from './AssignRoleModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';

export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AddUserModal />
            <AssignRoleModal />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
