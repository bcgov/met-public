import { Grid, Typography } from '@mui/material';
import { MetHeader1 } from 'components/common';
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
                <MetHeader1 align="center">{errorCode}</MetHeader1>
            </Grid>
            <Grid item xs={12} justifyContent="center">
                <MetHeader1 align="center">{errorMessage}</MetHeader1>
            </Grid>
        </Grid>
    );
});

export default NotFound;
