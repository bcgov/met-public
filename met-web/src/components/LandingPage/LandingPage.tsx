import React, { useState } from 'react';
import EnhancedTable from './Table';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { MetPageGridContainer } from '../common';

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
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} md={4} lg={3}>
                <SearchBar onClick={handleSearchBarClick} />
            </Grid>
            <Grid item xs={0} md={4} lg={4}></Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Link to="/engagement/form/create">
                    <Button variant="contained" fullWidth>
                        + Create An Engagement
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12} lg={10}>
                <EnhancedTable filter={searchFilter} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default LandingPage;
