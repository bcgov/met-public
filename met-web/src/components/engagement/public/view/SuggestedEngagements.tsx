import React, { Suspense } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { TileSkeleton } from 'components/landing/TileSkeleton';
import { Engagement } from 'models/engagement';
import EngagementTile from 'components/landing/EngagementTile';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'components/common/Navigation';
import { Await, useLoaderData } from 'react-router';
import { RepeatedGrid } from 'components/common';
import { EngagementLoaderPublicData } from './EngagementLoaderPublic';
import { EngagementViewSections } from '.';

export const SuggestedEngagements = () => {
    const { suggestedEngagements } = useLoaderData() as EngagementLoaderPublicData;

    return (
        <section id={EngagementViewSections.MORE_ENGAGEMENTS} aria-label="Suggested Engagements">
            <Box sx={{ padding: { xs: '64px 16px 24px 16px', md: '64px 5vw 40px 5vw', lg: '64px 10em 40px 10em' } }}>
                <Header2 weight="thin" sx={{ mb: '10px' }} decorated>
                    You may also be interested in
                </Header2>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% + 32px)"
                    m="0 -16px"
                    rowSpacing={4}
                >
                    <Suspense
                        fallback={
                            <RepeatedGrid
                                size="auto"
                                times={4}
                                width="320px"
                                m="0 16px"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <TileSkeleton />
                            </RepeatedGrid>
                        }
                    >
                        <Await resolve={suggestedEngagements}>
                            {(engagements: Engagement[]) =>
                                engagements.map((engagement, index) => {
                                    return (
                                        <Grid
                                            size="auto"
                                            key={`Grid-${engagement.id}`}
                                            width="320px"
                                            m="0 16px"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <EngagementTile
                                                passedEngagement={engagement}
                                                engagementId={engagement.id}
                                            />
                                        </Grid>
                                    );
                                })
                            }
                        </Await>
                    </Suspense>
                </Grid>
                <Grid container justifyContent="center" alignItems={'center'} direction={'row'}>
                    <Grid size={12} mt="64px" textAlign={'center'}>
                        <Link to="/" sx={{ color: (theme) => theme.palette.text.primary, textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faArrowLeftLong} style={{ paddingRight: '8px' }} />
                            All engagements
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </section>
    );
};
