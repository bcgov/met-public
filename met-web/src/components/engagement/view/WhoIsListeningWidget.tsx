import React from 'react';
import { MetPaper, MetHeader2, MetHeader3 } from 'components/common';
import { Grid, Avatar, Link } from '@mui/material';

const testData = {
    image: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/cocker-spaniel-2785074__340.jpg',
    name: 'Remy Sharp',
    email: 'TheJad@bc.gov.ca',
    phone: '647-543-1332',
};

const WhoIsListeningWidget = () => {
    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid item sx={{ pb: 2 }} justifyContent="flex-start" alignItems="center" xs={12}>
                <MetHeader2 bold={true}>Who is Listening</MetHeader2>
            </Grid>
            <Grid container item spacing={1} xs={12}>
                <Grid item xs={4}>
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
                    justifyContent="flex-start"
                    direction="row"
                    rowSpacing={1}
                    xs={8}
                >
                    <Grid item xs={12}>
                        <MetHeader3>
                            <strong>{testData.name}</strong>
                        </MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <Link href={`mailto:${testData.email}`}>{testData.email}</Link>
                    </Grid>
                    <Grid item xs={12}>
                        Phone: <Link href={`tel:${testData.phone}`}>{testData.phone}</Link>
                    </Grid>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default WhoIsListeningWidget;
