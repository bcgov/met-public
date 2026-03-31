import React from 'react';
import { Grid2 as Grid, Skeleton } from '@mui/material';

export const UserDetailsSkeleton = () => {
    return (
        <>
            <Grid container direction="row" rowSpacing={1} sx={{ mb: 4 }} spacing={2}>
                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>

                <Grid container direction="row" size={6} spacing={1}>
                    <Skeleton variant="text" width={200} height="2em" />
                </Grid>
            </Grid>
            <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} size={12}>
                <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} size={6}>
                    <Skeleton variant="text" width={200} height="4em" />
                </Grid>
            </Grid>
            <Grid size={12}>
                <Skeleton variant="rectangular" height="30em" width={'100%'} />
            </Grid>
        </>
    );
};

export default UserDetailsSkeleton;
