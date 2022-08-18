import React from 'react';
import { ActionProvider } from './ActionContext';
import EngagementView from './EngagementView';
import { EngagementRouteProps } from './types';
import { useLocation } from 'react-router-dom';
export const Engagement = () => {
    const state =
        useLocation().state != null ? (useLocation().state as EngagementRouteProps) : (useLocation().state as null);

    return (
        <ActionProvider>
            <EngagementView state={state} />
        </ActionProvider>
    );
};

export default Engagement;
