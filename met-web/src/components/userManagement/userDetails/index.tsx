import React from 'react';
import { UserDetails } from './UserDetails';
import { ActionProvider } from './UserActionProvider';
import { AddToEngagementModal } from './AddToEngagement';

export const UserProfile = () => {
    return (
        <ActionProvider>
            <UserDetails />
            <AddToEngagementModal />
        </ActionProvider>
    );
};

export default UserProfile;
