import React, { Suspense, useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { TileSkeleton } from 'components/landing/TileSkeleton';
import EngagementTile from 'components/landing/EngagementTile';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'components/common/Navigation';
import { Await, useLoaderData } from 'react-router';
import { colors, RepeatedGrid } from 'components/common';
import { EngagementLoaderPublicData } from './EngagementLoaderPublic';
import { EngagementViewSections } from '.';
import { SuggestedEngagementWithAttachment } from 'models/suggestedEngagement';
import { Engagement } from 'models/engagement';

export const SuggestedEngagements = ({ isPublic }: { isPublic: boolean }) => {
    const { suggestions: sugs, engagement: eng } = useLoaderData() as EngagementLoaderPublicData;
    const engagementSlots = Array.from({ length: 3 });
    const [suggestions, setSuggestions] = useState<SuggestedEngagementWithAttachment[]>();
    const [engagement, setEngagement] = useState<Engagement>();

    useEffect(() => {
        const getLoaderData = async () => {
            setSuggestions(await sugs);
            setEngagement(await eng);
        };
        getLoaderData();
    }, [eng, sugs]);

    const placeholderStyles = {
        border: `2px dashed ${colors.surface.blue[80]}`,
        borderRadius: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.surface.blue[80],
        display: 'flex',
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
            <Await resolve={[sugs, eng]}>
                <>
                    {!suggestions || suggestions?.length < 1 ? null : ( // Do not render component if no suggestions are available
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
                                    {engagement?.more_engagements_heading || 'You may also be interested in'}
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
                                        const sug = suggestions.find((s) => s.sort_index === i + 1);
                                        // Empty suggestion slot in public engagement
                                        if (!sug && isPublic) return <></>;
                                        // Outlined slot in preview window
                                        if (!sug && !isPublic)
                                            return (
                                                <Grid
                                                    key={`Placeholder-${i + 1}`}
                                                    size="auto"
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
                                            );
                                        /* Regular engagement card (preview window and public engagement) */
                                        if (sug)
                                            return (
                                                <Grid
                                                    size="auto"
                                                    key={`Grid-${sug?.suggested_engagement_id}`}
                                                    width="320px"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <EngagementTile
                                                        passedEngagement={sug.engagement as Engagement}
                                                        engagementId={sug.suggested_engagement_id as number}
                                                    />
                                                </Grid>
                                            );
                                    })}
                                </Grid>
                                <Grid container justifyContent="center" alignItems="center" direction="row">
                                    <Grid size={12} mt="64px" textAlign={'center'}>
                                        <Link
                                            to="/"
                                            sx={{
                                                color: (theme) => theme.palette.text.primary,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faArrowLeftLong} style={{ paddingRight: '8px' }} />
                                            All engagements
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </section>
                    )}
                </>
            </Await>
        </Suspense>
    );
};
