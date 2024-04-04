import React from 'react';
import { EngagementContextProvider } from './EngagementContentContext';
import { ContentTabs } from './ContentTabs';

const EngagementContentTabs = () => {
    return (
        <EngagementContextProvider>
            <ContentTabs />
        </EngagementContextProvider>
    );
};

export default EngagementContentTabs;
