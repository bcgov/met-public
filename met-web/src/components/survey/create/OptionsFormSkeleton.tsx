import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { MetPageGridContainer, RepeatedGrid } from 'components/common';
import React from 'react';

export const OptionsFormSkeleton = () => {
    return (
        <MetPageGridContainer container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3">
                    <Skeleton />
                </Typography>
            </Grid>
            <Grid
                item
                lg={6}
                xs={12}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <Grid item xs={12}>
                    <Typography variant="h6">
                        <Skeleton />
                    </Typography>
                </Grid>
                <RepeatedGrid times={3} item xs={12}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Skeleton variant="circular" width={30} height={30} />
                        <Typography variant="h6" width="100%">
                            <Skeleton />
                        </Typography>
                    </Stack>
                </RepeatedGrid>
            </Grid>
        </MetPageGridContainer>
    );
};
