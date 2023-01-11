import React from 'react';
import { AddUserModel } from './AddUserModal';
import { UserManagementContextProvider } from './UserManagementContext';
import UserManagementListing from './UserManagementListing';

export const WhoIsListening = () => {
    return (
        <UserManagementContextProvider>
            <UserManagementListing />
            <AddUserModel />
        </UserManagementContextProvider>
    );
};

export default WhoIsListening;
