import React from 'react';
import Grid from '@mui/material/Grid';
import { MetHeader1Old } from 'components/common';
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
            <MetHeader1Old>Welcome to MET</MetHeader1Old>
        </Grid>
    );
};

export default HomePage;
