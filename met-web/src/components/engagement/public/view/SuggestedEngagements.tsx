import React, { Suspense } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { TileSkeleton } from 'components/landing/TileSkeleton';
import EngagementTile from 'components/landing/EngagementTile';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'components/common/Navigation';
import { Await, useLoaderData } from 'react-router';
import { RepeatedGrid } from 'components/common';
import { EngagementLoaderPublicData } from './EngagementLoaderPublic';
import { EngagementViewSections } from '.';
import { SuggestedEngagementWithAttachment } from 'models/suggestedEngagement';
import { Engagement } from 'models/engagement';
import { previewValue } from 'engagements/preview/PreviewSwitch';
import { usePreview } from 'engagements/preview/PreviewContext';

export const SuggestedEngagements = () => {
    const { suggestions, engagement } = useLoaderData() as EngagementLoaderPublicData;
    const engagementSlots = Array.from({ length: 3 });
    const { isPreviewMode } = usePreview();

    const placeholderStyles = {
        border: `2px dashed`,
        borderColor: 'primary.light',
        borderRadius: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.light',
        minHeight: '442px',
        userSelect: 'none',
    };

    return (
        <Suspense
            fallback={
                <RepeatedGrid
                    size="auto"
                    times={3}
                    width="320px"
                    m="0 16px"
                    alignItems="center"
                    justifyContent="center"
                >
                    <TileSkeleton />
                </RepeatedGrid>
            }
        >
            <Await resolve={Promise.all([suggestions, engagement])}>
                {([sugs, eng]: [SuggestedEngagementWithAttachment[], Engagement]) =>
                    !sugs || sugs?.length < 1 ? null : ( // Do not render component if no suggestions are available
                        <section id={EngagementViewSections.MORE_ENGAGEMENTS} aria-label="Suggested Engagements">
                            <Box
                                sx={{
                                    padding: {
                                        xs: '64px 16px 24px 16px',
                                        md: '64px 5vw 40px 5vw',
                                        lg: '64px 10em 40px 10em',
                                    },
                                }}
                            >
                                <Header2 weight="thin" sx={{ mb: '42px' }} decorated>
                                    {eng?.more_engagements_heading || 'You may also be interested in'}
                                </Header2>
                                <Grid
                                    container
                                    direction={{ xs: 'column', lg: 'row' }}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ flexWrap: { xs: 'wrap', lg: 'nowrap' } }}
                                    size={12}
                                    rowSpacing={4}
                                >
                                    {engagementSlots.map((_, i) => {
                                        const sug = sugs.find((s) => s.sort_index === i + 1);
                                        return previewValue<React.ReactNode>({
                                            isPreviewMode: isPreviewMode,
                                            hasValue: Boolean(sug),
                                            value: sug ? (
                                                <Grid size="auto" key={`Grid-${sug.suggested_engagement_id}`}>
                                                    <EngagementTile
                                                        passedEngagement={sug.engagement as Engagement}
                                                        engagementId={sug.suggested_engagement_id as number}
                                                    />
                                                </Grid>
                                            ) : null,
                                            previewFallback: (
                                                <Grid
                                                    key={`Placeholder-${i + 1}`}
                                                    size="auto"
                                                    container
                                                    width="320px"
                                                    sx={placeholderStyles}
                                                >
                                                    <p
                                                        aria-label="There is no engagement loaded in this slot."
                                                        style={{ fontSize: '1.25rem' }}
                                                    >
                                                        Engagement Card
                                                    </p>
                                                </Grid>
                                            ),
                                            fallback: null,
                                        });
                                    })}
                                </Grid>
                                <Grid size={12} mt="64px" textAlign={'center'}>
                                    <Link to="/" sx={{ color: 'text.primary' }}>
                                        <FontAwesomeIcon icon={faArrowLeftLong} style={{ paddingRight: '8px' }} />
                                        All engagements
                                    </Link>
                                </Grid>
                            </Box>
                        </section>
                    )
                }
            </Await>
        </Suspense>
    );
};
