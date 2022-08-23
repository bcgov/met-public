import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
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
            <Typography variant="h3">Welcome to MET</Typography>
        </Grid>
    );
};

export default HomePage;
