import React from 'react';
import FormTabs from './FormTabs';
import { EngagementTabsContextProvider } from './EngagementTabsContext';

const EngagementFormTabs = () => {
    return (
        <EngagementTabsContextProvider>
            <FormTabs />
        </EngagementTabsContextProvider>
    );
};

export default EngagementFormTabs;
