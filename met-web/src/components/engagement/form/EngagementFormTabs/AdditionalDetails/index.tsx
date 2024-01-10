import React from 'react';
import { Grid } from '@mui/material';
import { MetPaper } from 'components/common';
import EngagementInformation from './EngagementInformation';

const EngagementAdditionalDetails = () => {
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
            </Grid>
        </MetPaper>
    );
};

export default EngagementAdditionalDetails;
