import { BodyText, EyebrowText, Header1 } from 'components/common/Typography';
import React, { Suspense } from 'react';
import { Button } from 'components/common/Input';
import { Engagement } from 'models/engagement';
import { Box, Grid, Skeleton } from '@mui/material';
import { colors } from 'components/common';
import { EngagementStatusChip } from 'components/common/Indicators';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Await, useLoaderData } from 'react-router';
import { StatusChipSkeleton } from 'components/common/Indicators/StatusChip';
import { EngagementLoaderData, EngagementViewSections } from '.';

export const EngagementHero = () => {
    const dateFormat = 'MMM DD, YYYY';
    const semanticDateFormat = 'YYYY-MM-DD';
    const { engagement } = useLoaderData() as EngagementLoaderData;
    const startDate = engagement?.then((engagement) => dayjs(engagement.start_date));
    const endDate = engagement?.then((engagement) => dayjs(engagement.end_date));
    const engagementInfo = Promise.all([engagement, startDate, endDate]);

    return (
        <section aria-label="Engagement Overview" id={EngagementViewSections.HERO}>
            <Suspense
                fallback={
                    <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: '160px', md: '840px' } }} />
                }
            >
                <Await resolve={engagement}>
                    {(engagement: Engagement) => (
                        <Box
                            sx={{
                                width: '100%',
                                height: { xs: '160px', md: '840px' },
                                background: `url(${engagement.banner_url}) no-repeat center center`,
                                backgroundSize: 'cover',
                            }}
                        />
                    )}
                </Await>
            </Suspense>
            <Box
                sx={{
                    backgroundColor: colors.surface.white,
                    width: { xs: '100%', md: '720px' },
                    minHeight: '540px',
                    maxWidth: '100vw',
                    position: { xs: 'relative', md: 'absolute' },
                    marginTop: { xs: '-24px', md: '-715px' },
                    marginBottom: { xs: '24px', md: '161px' },
                    borderRadius: {
                        xs: '0px 24px 0px 0px', // upper right corner
                        md: '0px 24px 24px 0px', // upper right and lower right corners
                    },
                    padding: { xs: '43px 16px 75px 16px', md: '88px 48px 88px 5vw', lg: '88px 48px 88px 156px' },
                    boxShadow:
                        '0px 20px 11px 0px rgba(0, 0, 0, 0.00), 0px 12px 10px 0px rgba(0, 0, 0, 0.01), 0px 7px 9px 0px rgba(0, 0, 0, 0.05), 0px 3px 6px 0px rgba(0, 0, 0, 0.09), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
                    alignSelf: { xs: 'flex-start', md: 'center' },
                    alignContent: 'center',
                }}
            >
                <Suspense
                    fallback={
                        <>
                            <Skeleton>
                                <EyebrowText m="0">Sponsor Name</EyebrowText>
                            </Skeleton>
                            <Skeleton>
                                <Header1 weight="thin" sx={{ mb: '32px' }}>
                                    Engagement Name
                                </Header1>
                            </Skeleton>
                            <Grid container mb="48px" flexDirection="row" alignItems="center" columnSpacing={1}>
                                <Grid item>
                                    <StatusChipSkeleton />
                                </Grid>
                                <Grid item>
                                    <Skeleton>
                                        <BodyText bold size="small" sx={{ color: '#201F1E' }}>
                                            <time dateTime="2022-02-02">Feb 02, 2022</time> to{' '}
                                            <time dateTime="2022-02-02">Feb 02, 2022</time>
                                        </BodyText>
                                    </Skeleton>
                                </Grid>
                            </Grid>
                            <Skeleton
                                variant="rectangular"
                                sx={{ borderRadius: '8px', height: '56px', width: '152px' }}
                            />
                        </>
                    }
                >
                    <Await resolve={engagementInfo}>
                        {([engagement, startDate, endDate]: [Engagement, dayjs.Dayjs, dayjs.Dayjs]) => (
                            <>
                                <EyebrowText mb="24px">{engagement.sponsor_name}</EyebrowText>
                                <Header1 weight="thin" sx={{ color: colors.surface.gray[110], mb: '32px', mt: 0 }}>
                                    {engagement.name}
                                </Header1>
                                <Grid container mb="48px" flexDirection="row" alignItems="center" columnSpacing={1}>
                                    <Grid item>
                                        <EngagementStatusChip statusId={engagement.submission_status} />
                                    </Grid>
                                    <Grid item>
                                        <BodyText bold size="small" sx={{ color: '#201F1E' }}>
                                            <time dateTime={`${startDate.format(semanticDateFormat)}`}>
                                                {startDate.format(dateFormat)}
                                            </time>{' '}
                                            to{' '}
                                            <time dateTime={`${endDate.format(semanticDateFormat)}`}>
                                                {endDate.format(dateFormat)}
                                            </time>
                                        </BodyText>
                                    </Grid>
                                </Grid>
                                <Button
                                    href={
                                        engagement.status_block.find((block) => block.link_type === 'internal')
                                            ?.internal_link || '#cta-section'
                                    }
                                    LinkComponent={'a'}
                                    variant="primary"
                                    size="large"
                                    icon={<FontAwesomeIcon fontSize={24} icon={faChevronRight} />}
                                    iconPosition="right"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {engagement.status_block.find((block) => block.link_type === 'internal')
                                        ?.button_text || 'Learn More'}
                                </Button>
                            </>
                        )}
                    </Await>
                </Suspense>
            </Box>
        </section>
    );
};
