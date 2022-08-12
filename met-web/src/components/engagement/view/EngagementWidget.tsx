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
                <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
                    <Grid item sx={{ pb: 2 }} justifyContent="flex-start" alignItems="center" xs={12}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Who is Listening
                        </Typography>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                        <Grid item alignItems="center" justifyContent="center" xs={4}>
                            <Avatar
                                alt={testData.name}
                                src={testData.image}
                                sx={{ borderRadius: '0px', height: '100%', width: '100%' }}
                            />
                        </Grid>
                        <Grid
                            container
                            item
                            alignItems="flex-start"
                            justifyContent="center"
                            direction="column"
                            spacing={1}
                            xs={8}
                        >
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {testData.name}
                                </Typography>
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
