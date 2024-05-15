import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader2Old, MetHeader4, PrimaryButtonOld } from 'components/common';
import { useNavigate } from 'react-router-dom';

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
            <Grid item xs={12}>
                <MetHeader2Old variant="h2" align="center">
                    Unauthorized
                </MetHeader2Old>
            </Grid>
            <Grid item xs={12}>
                <MetHeader4 variant="h2" align="center">
                    You don't have the necessary authorization to view this page. Click the button below to go back
                </MetHeader4>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
                <Grid item>
                    <PrimaryButtonOld
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Go to home page
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Unauthorized;
