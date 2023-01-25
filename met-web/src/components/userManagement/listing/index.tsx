import React from 'react';
import { AddUserModel } from './AddUserModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';

export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AddUserModel />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
