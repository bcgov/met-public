import { Grid, Typography } from '@mui/material';
import React from 'react';
import { IProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/pro-regular-svg-icons/faScrewdriverWrench';

const UnderConstruction = React.memo(({ errorMessage = 'This page is under construction' }: IProps) => {
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
                <Typography variant="h2" align="center">
                    {errorMessage}
                </Typography>
            </Grid>
            <Grid item xs={12} container direction="row" alignItems="center" justifyContent="center">
                <FontAwesomeIcon
                    icon={faScrewdriverWrench}
                    style={{ padding: '20px', height: '10em', width: '10em' }}
                />
            </Grid>
        </Grid>
    );
});

export default UnderConstruction;
