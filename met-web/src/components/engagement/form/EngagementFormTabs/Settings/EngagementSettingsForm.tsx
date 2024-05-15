import React, { useContext } from 'react';
import { Divider, Grid, Box } from '@mui/material';
import { MetPaper, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import InternalEngagement from './InternalEngagement';
import SendReport from './SendReport';
import { PublicUrls } from './PublicUrls';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';

const EngagementSettingsForm = () => {
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
                    <InternalEngagement />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <SendReport />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <PublicUrls />
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
                        <PrimaryButtonOld
                            sx={{ marginRight: 1 }}
                            data-testid="save-engagement-button"
                            onClick={() => handleSaveAndContinueEngagement()}
                            loading={isSaving}
                        >
                            Save and Continue
                        </PrimaryButtonOld>
                        <PrimaryButtonOld
                            sx={{ marginRight: 1 }}
                            data-testid="save-and-exit-engagement-button"
                            onClick={() => handleSaveAndExitEngagement()}
                            loading={isSaving}
                        >
                            Save and Exit
                        </PrimaryButtonOld>
                        <SecondaryButtonOld
                            data-testid="preview-engagement-button"
                            onClick={() => handlePreviewEngagement()}
                            disabled={isSaving}
                        >
                            {'Preview'}
                        </SecondaryButtonOld>
                    </Grid>
                </Box>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettingsForm;
