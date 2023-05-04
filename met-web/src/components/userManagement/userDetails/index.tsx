import React from 'react';
import { UserDetails } from './UserDetails';
import { ActionProvider } from './UserActionProvider';

export const UserProfile = () => {
    return (
        <ActionProvider>
            <UserDetails />
        </ActionProvider>
    );
};

export default UserProfile;
