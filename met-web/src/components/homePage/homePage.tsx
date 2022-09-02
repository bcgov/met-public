import React from 'react';
import Grid from '@mui/material/Grid';
import { MetHeader1 } from 'components/common';
const HomePage = () => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            style={{ minHeight: '100vh' }}
        >
            <MetHeader1>Welcome to MET</MetHeader1>
        </Grid>
    );
};

export default HomePage;
