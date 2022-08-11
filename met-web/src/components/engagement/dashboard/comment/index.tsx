import React from 'react';
import { ActionProvider } from '../../view/ActionContext';
import EngagementCommentDashboard from './EngagementUserComments';

export const Dashboard = () => {
    return (
        <ActionProvider>
            <EngagementCommentDashboard />
        </ActionProvider>
    );
};

export default Dashboard;
