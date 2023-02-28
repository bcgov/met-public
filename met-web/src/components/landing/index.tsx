import React from 'react';
import { Grid } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { MetHeader1 } from 'components/common';
import EngagementTile from './EngagementTile';

export const Landing = () => {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Banner imageUrl="https://citz-gdx.objectstore.gov.bc.ca/new-bucket-048a62a2/6e20c9fe-e737-49fe-82eb-590c5ce575bc.jpg">
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: '0px',
                        }}
                    >
                        <Grid
                            item
                            lg={6}
                            sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12} sx={{ maxHeight: '20em', overflowY: 'auto', overflowX: 'auto', mb: 2 }}>
                                <MetHeader1>FC Bayern Munchen</MetHeader1>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ md: '1em', xs: '1em' }}
                rowSpacing={2}
                columnSpacing={1}
            >
                <Grid item xs={4}>
                    <EngagementTile engagementId={3} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Landing;
