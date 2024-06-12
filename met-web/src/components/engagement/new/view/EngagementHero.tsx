import { BodyText, EyebrowText, Header1 } from 'components/common/Typography';
import React from 'react';
import { Button } from 'components/common/Input';
import { Engagement } from 'models/engagement';
import { Box, Grid } from '@mui/material';
import { colors } from 'components/common';
import { EngagementStatusChip } from 'components/common/Indicators';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';

export const EngagementHero = ({ engagement }: { engagement: Engagement }) => {
    const dateFormat = 'MMM DD, YYYY';
    const semanticDateFormat = 'YYYY-MM-DD';
    const startDate = dayjs(engagement.start_date);
    const endDate = dayjs(engagement.end_date);

    return (
        <section aria-label="Engagement Overview">
            <Box
                sx={{
                    width: '100%',
                    height: { xs: '160px', md: '840px' },
                    background: `url(${engagement.banner_url}) no-repeat center center`,
                    backgroundSize: 'cover',
                }}
            ></Box>
            <Box
                sx={{
                    backgroundColor: colors.surface.white,
                    width: { xs: '100%', md: '720px' },
                    minHeight: '120px',
                    maxWidth: '100vw',
                    position: { xs: 'relative', md: 'absolute' },
                    marginTop: { xs: '-24px', md: '-679px' },
                    marginBottom: { xs: '24px', md: '161px' },
                    borderRadius: {
                        xs: '0px 24px 0px 0px', // upper right corner
                        md: '0px 24px 24px 0px', // upper right and lower right corners
                    },
                    padding: { xs: '43px 16px 75px 16px', md: '88px 48px 88px 5vw', lg: '88px 48px 88px 156px' },
                    boxShadow:
                        '0px 20px 11px 0px rgba(0, 0, 0, 0.00), 0px 12px 10px 0px rgba(0, 0, 0, 0.01), 0px 7px 9px 0px rgba(0, 0, 0, 0.05), 0px 3px 6px 0px rgba(0, 0, 0, 0.09), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
                }}
            >
                <EyebrowText m="0">{engagement.sponsor_name}</EyebrowText>
                <Grid container mt="16px" flexDirection="row" alignItems="center" columnSpacing={1}>
                    <Grid item>
                        <EngagementStatusChip statusId={engagement.submission_status} />
                    </Grid>
                    <Grid item>
                        <BodyText bold size="small" sx={{ color: '#201F1E' }}>
                            <time dateTime={`${startDate.format(semanticDateFormat)}`}>
                                {startDate.format(dateFormat)}
                            </time>{' '}
                            to{' '}
                            <time dateTime={`${endDate.format(semanticDateFormat)}`}>{endDate.format(dateFormat)}</time>
                        </BodyText>
                    </Grid>
                </Grid>
                <Header1 weight="thin" sx={{ color: colors.surface.gray[110], m: '40px 0' }}>
                    {engagement.name}
                </Header1>
                <Button
                    href={engagement.cta_url || '#cta-section'}
                    variant="primary"
                    icon={<FontAwesomeIcon fontSize={24} icon={faChevronRight} />}
                    iconPosition="right"
                    sx={{ borderRadius: '8px' }}
                >
                    {engagement.cta_message || 'Learn more'}
                </Button>
            </Box>
        </section>
    );
};
