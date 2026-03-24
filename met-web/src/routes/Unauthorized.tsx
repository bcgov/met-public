import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import { Header2, Header4 } from 'components/common/Typography';
import { Button } from 'components/common/Input/Button';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            padding={'2em 2em 1em 2em'}
        >
            <Grid size={12}>
                <Header2 decorated align="center">
                    Unauthorized
                </Header2>
            </Grid>
            <Grid size={12}>
                <Header4 variant="h2" align="center">
                    You don't have the necessary authorization to view this page. Click the button below to go back
                </Header4>
            </Grid>
            <Grid container size={12} justifyContent="center">
                <Grid>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Go to home page
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Unauthorized;
