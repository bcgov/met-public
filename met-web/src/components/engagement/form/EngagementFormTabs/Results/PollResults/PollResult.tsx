import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { EngagementPollContext } from './EngagementPollContext';
import ResultView from './ResultView';
import { MidScreenLoader } from 'components/common';

export const PollResult = () => {
    const { widget, isWidgetsLoading, isLoadingPollWidget, pollWidget, pollResults, isPollResultsLoading } =
        useContext(EngagementPollContext);

    // Show a loader while the data is being loaded
    if (isLoadingPollWidget || isWidgetsLoading || isPollResultsLoading) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <MidScreenLoader />
                </Grid>
            </Grid>
        );
    }

    // Check if both widget and pollWidget are available
    if (
        widget &&
        pollWidget &&
        widget.id !== undefined &&
        pollWidget.id !== undefined &&
        pollResults?.poll_id !== undefined
    ) {
        return <ResultView pollResult={pollResults} widget={widget} />;
    }

    // Display a message or handle the null case when widgetId or pollId is not available
    return null;
};

export default PollResult;
