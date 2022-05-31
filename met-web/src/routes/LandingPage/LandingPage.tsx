import React, { useState } from 'react';
import EnhancedTable from './Table';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';

const LandingPage = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });

    const handleSearchBarClick = (engagementNameFilter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: engagementNameFilter,
        });
    };
    return (
        <Container>
            <Grid direction="row" justifyContent="flex-start" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                    <SearchBar onClick={handleSearchBarClick} />
                </Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={3}>
                    <Link to="/engagement/create">
                        <Button variant="contained" fullWidth>
                            + Create An Engagement
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <EnhancedTable filter={searchFilter} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default LandingPage;
