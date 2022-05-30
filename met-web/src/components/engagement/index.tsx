import React from 'react';
import EngagementForm from './EngagementForm';
import { ActionProvider } from './ActionContext';

const Engagement = () => {
    return (
        <ActionProvider>
            <EngagementForm />
        </ActionProvider>
    );
};

export default Engagement;
