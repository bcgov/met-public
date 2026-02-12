import React, { Suspense } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { MetPaper } from 'components/common';
import { InvalidTokenModal } from './InvalidTokenModal';
import { EngagementLink } from './EngagementLink';
import { PreviewBanner } from './PreviewBanner';
import { useRouteLoaderData, Await } from 'react-router';
import { SurveyLoaderData } from '../building/SurveyLoader';

const SurveySubmit = () => {
    const { survey, slug, verification, engagement } = useRouteLoaderData('survey') as SurveyLoaderData;
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <PreviewBanner />
            </Grid>
            <Grid item xs={12}>
                <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="38em" />}>
                    <Await resolve={engagement}>
                        <SurveyBanner />
                    </Await>
                </Suspense>
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ lg: '2em 8em 1em 3em', md: '2em', xs: '1em' }}
            >
                <Grid item container direction="row" justifyContent="flex-end">
                    <Suspense fallback={<Skeleton variant="rectangular" width="15em" height="1em" />}>
                        <Await resolve={engagement}>
                            <EngagementLink />
                        </Await>
                    </Suspense>
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={2}>
                        <Suspense fallback={<Skeleton variant="rectangular" height="50em" width="100%" />}>
                            <Await resolve={Promise.all([survey, verification, slug])}>
                                <SurveyForm />
                            </Await>
                        </Suspense>
                        <Suspense>
                            <Await resolve={Promise.allSettled([verification, slug])}>
                                <InvalidTokenModal />
                            </Await>
                        </Suspense>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmit;
