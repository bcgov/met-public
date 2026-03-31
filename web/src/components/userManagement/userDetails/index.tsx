import React from 'react';
import { UserDetails } from './UserDetails';
import { AddToEngagementModal } from './AddToEngagement';
import { UserDetailsContextProvider } from './UserDetailsContext';
import { ResponsiveContainer } from 'components/common/Layout';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';

export const UserProfile = () => {
    return (
        <UserDetailsContextProvider>
            <ResponsiveContainer>
                <AutoBreadcrumbs />
                <UserDetails />
            </ResponsiveContainer>
            <AddToEngagementModal />
        </UserDetailsContextProvider>
    );
};

export default UserProfile;
