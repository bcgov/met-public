import { Grid, Typography } from '@mui/material';
import React from 'react';
import { IProps } from './types';

const NotFound = React.memo(({ errorMessage = 'Page Not Found', errorCode = '404' }: IProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            spacing={1}
            padding={'2em 2em 1em 2em'}
        >
            <Grid item xs={12} justifyContent="center">
                <Typography variant="h2" component="h2" align="center">
                    {errorCode}
                </Typography>
            </Grid>
            <Grid item xs={12} justifyContent="center">
                <Typography variant="h2" component="h2" align="center">
                    {errorMessage}
                </Typography>
            </Grid>
        </Grid>
    );
});

export default NotFound;
