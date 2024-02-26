import React, { useContext } from 'react';
import { Divider, Grid, Box } from '@mui/material';
import { MetPaper, PrimaryButton, SecondaryButton } from 'components/common';
import ConsentMessage from './ConsentMessage';
import EngagementInformation from './EngagementInformation';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { AdditionalDetailsContext } from './AdditionalDetailsContext';

const AdditionalTabContent = () => {
    const { handleSaveAdditional, updatingAdditional } = useContext(AdditionalDetailsContext);
    const { isSaving } = useContext(ActionContext);
    const { handleSaveEngagement, handlePreviewEngagement } = useContext(EngagementTabsContext);

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
                    <EngagementInformation />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <ConsentMessage />
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton loading={updatingAdditional} onClick={handleSaveAdditional}>
                        Save
                    </PrimaryButton>
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
                            onClick={() => handleSaveEngagement()}
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

export default AdditionalTabContent;
