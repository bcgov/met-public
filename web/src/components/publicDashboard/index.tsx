import React from 'react';
import Dashboard from './Dashboard';
import { DashboardContextProvider } from './DashboardContext';

export const publicDashboard = () => {
    return (
        <DashboardContextProvider>
            <Dashboard />
        </DashboardContextProvider>
    );
};

export default publicDashboard;
