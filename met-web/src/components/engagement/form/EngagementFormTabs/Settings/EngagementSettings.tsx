import React from 'react';
import { Grid } from '@mui/material';
import { MetPaper, MetHeader4 } from '../../../../common';

import EngagementInformation from './EngagementInformation';
import InternalEngagement from './InternalEngagement';
import SendReport from './SendReport';
import { PublicUrls } from './PublicUrls';

const EngagementSettings = () => {
    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                sx={{ padding: '2em' }}
            >
                <Grid item xs={12}>
                    <EngagementInformation />
                </Grid>

                <Grid item xs={12}>
                    <InternalEngagement />
                </Grid>

                <Grid item xs={12}>
                    <SendReport />
                </Grid>

                <Grid item xs={12} mt={1}>
                    <MetHeader4 bold>{`Public URLs (Links)`}</MetHeader4>
                </Grid>

                <Grid item xs={12}>
                    <PublicUrls />
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettings;
