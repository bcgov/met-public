import React from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetPageGridContainer } from 'components/common';

export const UserDetailsSkeleton = () => {
    return (
        <MetPageGridContainer>
            <Grid container direction="row" item rowSpacing={1} sx={{ mb: 4 }} spacing={2}>
                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>
            </Grid>
            <Grid container item justifyContent={'flex-end'} alignItems={'flex-end'} xs={12}>
                <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} item xs={6}>
                    <Skeleton variant="text" width={200} height="4em" />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Skeleton variant="rectangular" height="30em" width={'100%'} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetailsSkeleton;
