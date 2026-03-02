import React, { Suspense } from 'react';
import { Box, Grid } from '@mui/material';
import { TileSkeleton } from 'components/landing/TileSkeleton';
import { Engagement } from 'models/engagement';
import EngagementTile from 'components/landing/EngagementTile';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'components/common/Navigation';
import { Await, useLoaderData } from 'react-router';
import { RepeatedGrid } from 'components/common';
import { EngagementLoaderPublicData } from './EngagementLoaderPublic';

export const SuggestedEngagements = () => {
    const { suggestedEngagements } = useLoaderData() as EngagementLoaderPublicData;

    return (
        <section id="suggested-engagements" aria-label="Suggested Engagements">
            <Box sx={{ padding: { xs: '64px 16px 24px 16px', md: '64px 5vw 40px 5vw', lg: '64px 156px 40px 156px' } }}>
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
                                times={4}
                                item
                                width="320px"
                                m="0 16px"
                                sx={{
                                    flexBasis: '320px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
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
                                            key={`Grid-${engagement.id}`}
                                            item
                                            width="320px"
                                            m="0 16px"
                                            sx={{
                                                flexBasis: '320px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
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
                    <Grid item xs={12} mt="64px" textAlign={'center'}>
                        <Link to="/" sx={{ color: (theme) => theme.palette.text.primary, textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ paddingRight: '8px' }} />
                            All engagements
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </section>
    );
};
