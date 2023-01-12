import { Grid } from '@mui/material';
import React from 'react';
import { MetHeader2, MetHeader4 } from 'components/common';

const NoAccess = () => {
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
                <MetHeader2 variant="h2" align="center">
                    Access Request
                </MetHeader2>
            </Grid>
            <Grid item xs={12} justifyContent="center">
                <MetHeader4 variant="h2" align="center">
                    Your login was successful and an email has been sent to our administrators to request your access.
                    Once your request is processed, you'll get a notification email to confirm you can now access MET
                    with your credentials. Thank you.
                </MetHeader4>
            </Grid>
        </Grid>
    );
};

export default NoAccess;
