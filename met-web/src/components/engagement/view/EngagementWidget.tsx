import React from 'react';
import { MetPaper } from 'components/common';
import { Grid, Typography, Avatar, Link } from '@mui/material';

const testData = {
    image: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/cocker-spaniel-2785074__340.jpg',
    name: 'Remy Sharp',
    email: 'TheJad@bc.gov.ca',
    phone: '647-543-1332',
};

export default function EngagementWidget() {
    return (
        <Grid container alignItems="center" justifyContent="center" spacing={2} xs={12}>
            <Grid item container xs={11}>
                <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '10em' }}>
                    <Grid item justifyContent="flex-start" alignItems="center" xs={12}>
                        <Typography variant="h5">
                            <strong>Who is Listening</strong>
                        </Typography>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                        <Grid item alignItems="center" justifyContent="center" xs={4}>
                            <Avatar
                                alt={testData.name}
                                src={testData.image}
                                sx={{ borderRadius: '0px', height: '80%', width: '100%' }}
                            />
                        </Grid>
                        <Grid container item alignItems="flex-start" justifyContent="center" direction="column" xs={8}>
                            <Grid item xs={3} sx={{ fontWeight: 'bold' }}>
                                {testData.name}
                            </Grid>
                            <Grid item xs={3}>
                                <Link href={`mailto:${testData.email}`}>{testData.email}</Link>
                            </Grid>
                            <Grid item xs={2}>
                                Phone: <Link href={`tel:${testData.phone}`}>{testData.phone}</Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </Grid>
    );
}
