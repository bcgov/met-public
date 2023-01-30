import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { MetLabel, MetPaper, PrimaryButton, MetParagraph } from 'components/common';
import { ActionContext } from '../ActionContext';
import TeamMemberListing from './TeamMemberListing';
import { EngagementTabsContext } from './EngagementTabsContext';

const EngagementUserManagement = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { setAddTeamMemberOpen } = useContext(EngagementTabsContext);

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
                            <MetParagraph sx={{ ml: 2 }}>{savedEngagement.created_date}</MetParagraph>
                        </Grid>
                    </Grid>

                    <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1}>
                        <PrimaryButton onClick={() => setAddTeamMemberOpen(true)}>+ Add Team Member</PrimaryButton>
                    </Grid>

                    <Grid item xs={12}>
                        <TeamMemberListing />
                    </Grid>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementUserManagement;
