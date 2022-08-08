import React from 'react';
import { ActionProvider } from '../../view/ActionContext';
import EngagementDashboard from './EngagementDashboard';

export const Dashboard = () => {
    return (
        <ActionProvider>
            <EngagementDashboard />
        </ActionProvider>
    );
};

export default Dashboard;
