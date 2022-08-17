import React from 'react';
import { useLocation } from 'react-router-dom';
import { ActionProvider } from './ActionContext';
import EngagementView from './EngagementView';

export const Engagement = () => {
    const { state } = useLocation();
    return (
        <ActionProvider>
            <EngagementView open={state} />
        </ActionProvider>
    );
};

export default Engagement;
