import React from 'react';
import PublicDashboard from './publicDashboard';
import { DashboardContextProvider } from './DashboardContext';

export const publicDashboard = () => {
    return (
        <DashboardContextProvider>
            <PublicDashboard />
        </DashboardContextProvider>
    );
};

export default publicDashboard;
