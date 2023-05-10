import React from 'react';
import { AddUserModal } from './AddUserModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';

export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AddUserModal />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
