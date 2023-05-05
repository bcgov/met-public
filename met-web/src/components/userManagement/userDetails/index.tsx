import React from 'react';
import { UserDetails } from './UserDetails';
import { ActionProvider } from './UserActionProvider';
import { AddUserModal } from './AddUserModal';

export const UserProfile = () => {
    return (
        <ActionProvider>
            <UserDetails />
            <AddUserModal />
        </ActionProvider>
    );
};

export default UserProfile;
