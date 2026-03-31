import React from 'react';
import { Skeleton, Grid2 as Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';

export const FormBuilderSkeleton = () => {
    return (
        <ResponsiveContainer
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
            rowSpacing={4}
            columnSpacing={2}
        >
            <Grid size={12}>
                <Skeleton variant="rectangular" width="100%" height="3em" />
            </Grid>
            <Grid size={2}>
                <Skeleton variant="rectangular" width="100%" height="30em" />
            </Grid>
            <Grid size={10} container alignItems="flex-start" justifyContent="flex-start" direction="row" spacing={2}>
                <Grid size={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid size={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid size={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
                <Grid size={12}>
                    <Skeleton variant="rectangular" width="100%" height="3em" />
                </Grid>
            </Grid>
        </ResponsiveContainer>
    );
};

export default FormBuilderSkeleton;
