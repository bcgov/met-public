import React from 'react';
import EnhancedTable from '../../components/layout/Table/Table';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <Container>
            <Grid direction="row" justifyContent="center" alignItems="center" container spacing={2}>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                    <Link to="/engagement/create">
                        <Button variant="contained" fullWidth>
                            + Create An Engagement
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <EnhancedTable />
                </Grid>
            </Grid>
        </Container>
    );
};

export default LandingPage;
