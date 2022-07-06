import React from 'react';
import { Skeleton, Grid } from '@mui/material';
import { MetPageGridContainer } from 'components/common';

export const FormBuilderSkeleton = () => {
    return (
        <MetPageGridContainer container alignItems="flex-start" justifyContent="flex-start" direction="row" spacing={2}>
            <Grid item xs={12}>
                <Skeleton variant="rectangular" width="100%" height="3em" />
            </Grid>
            <Grid item xs={2}>
                <Skeleton variant="rectangular" width="100%" height="30em" />
            </Grid>
            <Grid
                item
                xs={10}
                container
                alignItems="flex-start"
                justifyContent="flex-start"
                direction="row"
                spacing={2}
            >
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
            </Grid>
        </MetPageGridContainer>
    );
};

export default FormBuilderSkeleton;
