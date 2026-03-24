import React from 'react';
import { BodyText, Header1 } from 'components/common/Typography';
import { Grid2 as Grid, Paper } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { Tabs } from './Tabs';
import { useAppTranslation } from 'hooks';

export const Form = () => {
    const { t: translate } = useAppTranslation();

    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid size={12}>
                <Banner height={'330px'} imageUrl={LandingPageBanner}>
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
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid size={12}>
                                <Header1>{translate('formCAC.form.header')}</Header1>
                            </Grid>
                            <Grid size={12}>
                                <BodyText>{translate('formCAC.form.paragraph')}</BodyText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid size={12} m={'1em'}>
                <Paper sx={{ padding: '3em' }}>
                    <Tabs />
                </Paper>
            </Grid>
        </Grid>
    );
};
