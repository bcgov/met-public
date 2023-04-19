import React from 'react';
import Submissions from './Submissions';
import { CommentListingContextProvider } from './CommentListingContext';

const SubmissionListing = () => {
    return (
        <CommentListingContextProvider>
            <Submissions />
        </CommentListingContextProvider>
    );
};

export default SubmissionListing;
