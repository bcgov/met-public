import React, { useContext } from 'react';
import { Divider, Grid, Box } from '@mui/material';
import { MetPaper, PrimaryButton, SecondaryButton } from 'components/common';
import InternalEngagement from './InternalEngagement';
import SendReport from './SendReport';
import { EngagementSettingsContext } from './EngagementSettingsContext';
import { PublicUrls } from './PublicUrls';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';

const EngagementSettingsForm = () => {
    const { handleSaveSettings, updatingSettings } = useContext(EngagementSettingsContext);
    const { isSaving } = useContext(ActionContext);
    const { handleSaveAndContinueEngagement, handlePreviewEngagement } = useContext(EngagementTabsContext);

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
                    <PrimaryButton loading={updatingSettings} onClick={handleSaveSettings}>
                        Save
                    </PrimaryButton>
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
                    borderTop="1px solid #ddd"
                    padding={2}
                    marginTop={2}
                    marginLeft={2}
                    zIndex={1000}
                    boxShadow="0px 0px 5px rgba(0, 0, 0, 0.1)"
                    sx={{ backgroundColor: 'white' }}
                >
                    <Grid item xs={12}>
                        <PrimaryButton
                            sx={{ marginRight: 1 }}
                            data-testid="create-engagement-button"
                            onClick={() => handleSaveAndContinueEngagement()}
                            loading={isSaving}
                        >
                            Save
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

export default EngagementSettingsForm;
