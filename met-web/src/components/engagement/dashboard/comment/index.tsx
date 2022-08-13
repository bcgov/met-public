import React from 'react';
import { CommentViewProvider } from './CommentViewContext';
import EngagementCommentDashboard from './EngagementComments';

export const Dashboard = () => {
    return (
        <CommentViewProvider>
            <EngagementCommentDashboard />
        </CommentViewProvider>
    );
};

export default Dashboard;
