import React from 'react';
import { ActionProvider } from './ActionContext';
import EngagementView from './EngagementView';
import { EngagementRouteProps } from './types';
import { useLocation } from 'react-router-dom';
export const Engagement = () => {
    const state = useLocation().state;
    const routerState = state != null ? (useLocation().state as EngagementRouteProps) : (useLocation().state as null);

    window.history.replaceState({}, document.title);

    return (
        <ActionProvider>
            <EngagementView state={routerState} />
        </ActionProvider>
    );
};

export default Engagement;
