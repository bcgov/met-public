import React from 'react';
import { MetPaper, MetHeader3, MetBody } from 'components/common';
import { Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const WhoIsListeningOption = () => {
    return (
        <MetPaper
            elevation={1}
            sx={{ padding: '1px 2px 1px 2px', cursor: 'pointer', '&:hover': { backgroundColor: 'rgb(242, 242, 242)' } }}
            onClick={() => console.log('clicked')}
        >
            <Grid container alignItems="flex-start" justifyContent="flex-start" direction="row" columnSpacing={2}>
                <Grid item>
                    <PersonIcon sx={{ fontSize: '5em' }} />
                </Grid>
                <Grid
                    container
                    item
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    direction="row"
                    rowSpacing={1}
                    xs={8}
                >
                    <Grid item xs={12}>
                        <MetHeader3>Who is Listening</MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>{'Add one or a few contact(s) for this engagement'}</MetBody>
                    </Grid>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default WhoIsListeningOption;
