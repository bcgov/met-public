import React from 'react';
import { MetHeader1, MetPaper, MetParagraph } from 'components/common';
import { Grid } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { Tabs } from './Tabs';
import { useAppTranslation } from 'hooks';

export const Form = () => {
    const { t: translate } = useAppTranslation();

    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <MetHeader1>{translate('formCAC.form.header')}</MetHeader1>
                            </Grid>
                            <Grid item xs={12}>
                                <MetParagraph>{translate('formCAC.form.paragraph')}</MetParagraph>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid item xs={12} m={'1em'}>
                <MetPaper sx={{ padding: '3em' }}>
                    <Tabs />
                </MetPaper>
            </Grid>
        </Grid>
    );
};
