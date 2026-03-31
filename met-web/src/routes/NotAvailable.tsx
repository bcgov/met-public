import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography/Body';
import { Heading1 } from 'components/common/Typography';
import { Banner } from 'components/banner/Banner';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { useAppTranslation, useAppSelector } from 'hooks';
import { TenantState } from 'reduxSlices/tenantSlice';

export const NotAvailable = () => {
    const { t: translate } = useAppTranslation();
    const tenant: TenantState = useAppSelector((state) => state.tenant);
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
                            size={{ sm: 12, lg: 6 }}
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
                                <Heading1>{tenant.title}</Heading1>
                            </Grid>
                            <Grid size={12}>
                                <BodyText>{tenant.description}</BodyText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid
                size={12}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                    padding: '1em',
                    maxWidth: '100%',
                }}
                m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                rowSpacing={2}
            >
                <BodyText bold m={{ lg: '.5em 0 0 .5em', md: '3em', sm: '1em' }}>
                    {translate('notAvailable.label')}
                </BodyText>
            </Grid>
        </Grid>
    );
};

export default NotAvailable;
