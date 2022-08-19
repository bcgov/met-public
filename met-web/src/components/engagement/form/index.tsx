import React from 'react';
import { ActionProvider } from './ActionContext';
import EngagementFormWrapper from './EngagementFormWrapper';

const Engagement = () => {
    return (
        <ActionProvider>
            <EngagementFormWrapper />
        </ActionProvider>
    );
};

export default Engagement;
