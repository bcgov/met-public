import React from 'react';
import { CommentViewProvider } from './CommentViewContext';
import EngagementComments from './EngagementComments';

export const EngagementCommentsWrapper = () => {
    return (
        <CommentViewProvider>
            <EngagementComments />
        </CommentViewProvider>
    );
};

export default EngagementCommentsWrapper;
