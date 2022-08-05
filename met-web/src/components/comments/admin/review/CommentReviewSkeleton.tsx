import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { MetLabel, MetPageGridContainer, RepeatedGrid } from 'components/common';
import React from 'react';

export const CommentReviewSkeleton = () => {
    return (
        <MetPageGridContainer container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid
                container
                padding="3em"
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={2}
                columnSpacing={4}
            >
                <RepeatedGrid times={6} container item xs={5}>
                    <MetLabel width="100%">
                        <Skeleton />
                    </MetLabel>
                </RepeatedGrid>
                <Grid container item xs={5}>
                    <MetLabel width="100%">
                        <Skeleton />
                    </MetLabel>
                </Grid>

                <Grid container item xs={12}>
                    <Skeleton width="100%" height="6em" />
                </Grid>

                <Grid item xs={12} container>
                    <Grid item xs={4}>
                        <Typography variant="h6">
                            <Skeleton />
                        </Typography>
                    </Grid>
                </Grid>
                <RepeatedGrid times={2} item xs={12} container>
                    <Grid item xs={4}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton variant="circular" width={30} height={30} />
                            <Typography variant="h6" width="100%">
                                <Skeleton />
                            </Typography>
                        </Stack>
                    </Grid>
                </RepeatedGrid>
            </Grid>
        </MetPageGridContainer>
    );
};
