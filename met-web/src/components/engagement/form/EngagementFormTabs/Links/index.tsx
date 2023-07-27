import React from 'react';
import { Grid } from '@mui/material';
import { MetPaper } from 'components/common';
import { PublicUrls } from './PublicUrls';

const EngagementLinks = () => {
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
                    <PublicUrls />
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementLinks;
