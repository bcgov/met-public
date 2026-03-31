import React from 'react';
import { DashboardContextProvider } from './DashboardContext';
import EngagementList from './EngagementList';

export const Dashboard = () => {
    return (
        <DashboardContextProvider>
            <EngagementList />
        </DashboardContextProvider>
    );
};

export default Dashboard;
