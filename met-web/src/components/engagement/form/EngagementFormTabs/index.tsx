import React from 'react';
import FormTabs from './FormTabs';
import { EngagementTabsContextProvider } from './EngagementTabsContext';
import { AddTeamMemberModal } from './UserManagement/AddTeamMemberModal';

const EngagementFormTabs = () => {
    return (
        <EngagementTabsContextProvider>
            <FormTabs />
            <AddTeamMemberModal />
        </EngagementTabsContextProvider>
    );
};

export default EngagementFormTabs;
