import { Grid } from '@mui/material';
import { MetHeader1 } from 'components/common';
import React from 'react';
import { IProps } from './types';
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';

const NotFound = React.memo(
    ({ errorMessage = "We couldn't find page page your are looking for.", errorCode = '404' }: IProps) => {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                padding={'2em 2em 1em 2em'}
            >
                <Grid item xs={12} justifyContent="center">
                    <MetHeader1 align="center">
                        Oh no! Something went wrong.
                        <br />
                        {errorMessage} ({errorCode})
                    </MetHeader1>
                </Grid>
                <Grid item xs={12} container direction="row" alignItems="center" justifyContent="center">
                    <ErrorIcon sx={{ height: '10em', width: '10em' }} />
                </Grid>
            </Grid>
        );
    },
);

export default NotFound;
