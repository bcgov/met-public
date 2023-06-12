import React from 'react';
import { AssignRoleModal } from './AssignRoleModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';

export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AssignRoleModal />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
