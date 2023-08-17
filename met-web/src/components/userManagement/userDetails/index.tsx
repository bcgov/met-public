import React from 'react';
import { UserDetails } from './UserDetails';
import { AddToEngagementModal } from './AddToEngagement';
import { UserDetailsContextProvider } from './UserDetailsContext';

export const UserProfile = () => {
    return (
        <UserDetailsContextProvider>
            <UserDetails />
            <AddToEngagementModal />
        </UserDetailsContextProvider>
    );
};

export default UserProfile;
