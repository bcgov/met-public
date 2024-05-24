import React from 'react';
import { Grid } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { MetHeader1Old, MetParagraphOld } from 'components/common';
import TileBlock from './TileBlock';
import { Container } from '@mui/system';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import FilterBlock from './FilterBlock';
import FilterDrawer from './FilterDrawer';
const LandingComponent = () => {
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <FilterDrawer />
            <Grid item xs={12}>
                <Banner height="330px" imageUrl={LandingPageBanner}>
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
                                pt: 0,
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12}>
                                {/* TODO: LANG-BACKEND - Change the value to show tenant specific */}
                                <MetHeader1Old>Government Digital Experience Division</MetHeader1Old>
                            </Grid>
                            <Grid item xs={12}>
                                {/* TODO: LANG-BACKEND - Change the value to show tenant specific */}
                                <MetParagraphOld>Description about the office and public engagement.</MetParagraphOld>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>

            <Container maxWidth={false} sx={{ maxWidth: '1700px' }}>
                <Grid container item xs={12} direction="row" justifyContent="center" alignItems="center" rowSpacing={3}>
                    <FilterBlock />
                    <TileBlock />
                </Grid>
            </Container>
        </Grid>
    );
};

export default LandingComponent;
