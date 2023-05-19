import { Grid, Stack, Toolbar } from '@mui/material';
import React from 'react';
import { MetHeader1, MetHeader4 } from 'components/common';

const NoAccess = () => {
    return (
        <>
            <Toolbar />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                padding={'2em 2em 1em 2em'}
            >
                <Grid item sm={10} md={6} justifyContent="center">
                    <Stack>
                        <MetHeader1 bold variant="h1" align="flex-start" sx={{ mb: 3 }}>
                            Access Request
                        </MetHeader1>
                        <MetHeader4 variant="h2" align="flex-start">
                            Your login was successful and an email has been sent to our administrators to request your
                            access. Once your request is processed, you'll get a notification email to confirm you can
                            now access MET with your credentials. Thank you.
                        </MetHeader4>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default NoAccess;
