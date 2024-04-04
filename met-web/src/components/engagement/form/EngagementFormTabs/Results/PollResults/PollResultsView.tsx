import React from 'react';
import { EngagementPollContextProvider } from './EngagementPollContext';
import PollResult from './PollResult';

export const PollResultsView = () => {
    return (
        <EngagementPollContextProvider>
            <PollResult />
        </EngagementPollContextProvider>
    );
};

export default PollResultsView;
