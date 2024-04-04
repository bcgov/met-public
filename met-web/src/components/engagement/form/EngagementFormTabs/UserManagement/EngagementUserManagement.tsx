import React, { useContext } from 'react';
import { Grid, Box } from '@mui/material';
import { MetLabel, MetPaper, PrimaryButton, SecondaryButton, MetParagraph } from 'components/common';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { formatDate } from 'components/common/dateHelper';
import TeamMemberListing from './TeamMemberListing';

const EngagementUserManagement = () => {
    const { isSaving, savedEngagement } = useContext(ActionContext);
    const {
        handleSaveAndContinueEngagement,
        handleSaveAndExitEngagement,
        handlePreviewEngagement,
        setAddTeamMemberOpen,
    } = useContext(EngagementTabsContext);

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
                <Grid container direction="row" item rowSpacing={2}>
                    <Grid container direction="row" item xs={12} spacing={1}>
                        <Grid item>
                            <MetLabel>Engagement Created by:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ ml: 2 }}>{savedEngagement.user_id}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" item xs={12} spacing={1}>
                        <Grid item>
                            <MetLabel>Date Created:</MetLabel>
                        </Grid>
                        <Grid item>
                            <MetParagraph sx={{ ml: 2 }}>{formatDate(savedEngagement.created_date)}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1}>
                        <PrimaryButton onClick={() => setAddTeamMemberOpen(true)}>+ Add Team Member</PrimaryButton>
                    </Grid>

                    <Grid item xs={12}>
                        <TeamMemberListing />
                    </Grid>
                    <Box
                        position="sticky"
                        bottom={0}
                        width="100%"
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
            </Grid>
        </MetPaper>
    );
};

export default EngagementUserManagement;
