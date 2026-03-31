import React from 'react';
import { ThemeProvider, Grid2 as Grid } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import TileBlock from './TileBlock';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import FilterBlock from './FilterBlock';
import FilterDrawer from './FilterDrawer';
import { TenantState } from 'reduxSlices/tenantSlice';
import { useAppSelector } from '../../hooks';
import { BodyText, Heading1 } from 'components/common/Typography';
import { DarkTheme } from 'styles/Theme';

const LandingComponent = () => {
    const tenant: TenantState = useAppSelector((state) => state.tenant);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <ThemeProvider theme={DarkTheme}>
                <FilterDrawer />
            </ThemeProvider>
            <Grid size={12}>
                <Banner height="330px" imageUrl={tenant.heroImageUrl || LandingPageBanner}>
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
                            size={{ lg: 6, sm: 12 }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                borderRadius: '16px',
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 10em', md: '3em 5vw', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid size={12}>
                                <Heading1 sx={{ mt: 0 }}>{tenant.title}</Heading1>
                            </Grid>
                            <Grid size={12}>
                                <BodyText>{tenant.description}</BodyText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
                <Grid
                    container
                    size={12}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={3}
                    padding={{ xs: '0 1em 0', sm: '0 5vw 0', lg: '0 10em 0' }}
                >
                    <FilterBlock />
                    <TileBlock />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LandingComponent;
