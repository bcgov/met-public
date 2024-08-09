import React from 'react';
import { ActionProvider } from './ActionContext';
import EngagementView from './EngagementView';

export const Engagement = () => {
    return (
        <ActionProvider>
            <EngagementView />
        </ActionProvider>
    );
};

export default Engagement;
