import React, { useContext } from 'react';
import { Grid, Box } from '@mui/material';
import { MetPaper, PrimaryButton, SecondaryButton } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import PollResultsView from './PollResults/PollResultsView';

const EngagementResults = () => {
    const { isSaving } = useContext(ActionContext);
    const { handleSaveAndContinueEngagement, handleSaveAndExitEngagement, handlePreviewEngagement } =
        useContext(EngagementTabsContext);

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                sx={{ padding: '2em' }}
            >
                <Grid item xs={12}>
                    <PollResultsView />
                </Grid>
                <Box
                    position="sticky"
                    bottom={0}
                    width="100%"
                    marginLeft={2}
                    borderTop="1px solid #ddd"
                    padding={2}
                    marginTop={2}
                    zIndex={1000}
                    boxShadow="0px 0px 5px rgba(0, 0, 0, 0.1)"
                    sx={{ backgroundColor: 'var(--bcds-surface-background-white)' }}
                >
                    <Grid item xs={12}>
                        <PrimaryButton
                            sx={{ marginRight: 1 }}
                            data-testid="save-engagement-button"
                            onClick={() => handleSaveAndContinueEngagement()}
                            loading={isSaving}
                        >
                            Save and Continue
                        </PrimaryButton>
                        <PrimaryButton
                            sx={{ marginRight: 1 }}
                            data-testid="save-and-exit-engagement-button"
                            onClick={() => handleSaveAndExitEngagement()}
                            loading={isSaving}
                        >
                            Save and Exit
                        </PrimaryButton>
                        <SecondaryButton
                            data-testid="preview-engagement-button"
                            onClick={() => handlePreviewEngagement()}
                            disabled={isSaving}
                        >
                            {'Preview'}
                        </SecondaryButton>
                    </Grid>
                </Box>
            </Grid>
        </MetPaper>
    );
};

export default EngagementResults;
