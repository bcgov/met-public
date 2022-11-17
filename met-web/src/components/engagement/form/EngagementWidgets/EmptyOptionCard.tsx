import React from 'react';
import { MetPaper } from 'components/common';
import { Grid } from '@mui/material';

const EmptyOptionCard = () => {
    return (
        <MetPaper
            elevation={1}
            sx={{
                padding: '10px 2px 10px 2px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgb(242, 242, 242)' },
            }}
        >
            <Grid container alignItems="center" justifyContent="center" direction="row" height="5.5em" />
        </MetPaper>
    );
};

export default EmptyOptionCard;
