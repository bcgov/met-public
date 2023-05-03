import React from 'react';
import { AddUserModel } from './AddUserModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';
import UserDetails from './UserDetails';
export const UserManagement = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <UserDetails />
            <AddUserModel />
        </UserManagementContextProvider>
    );
};

export default UserManagement;
