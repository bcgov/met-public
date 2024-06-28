import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, CardActionArea, ThemeProvider } from '@mui/material';
import { Engagement } from 'models/engagement';
import { getEngagement } from 'services/engagementService';
import dayjs from 'dayjs';
import { EngagementStatusChip } from 'components/common/Indicators/StatusChip';
import { TileSkeleton } from './TileSkeleton';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getBaseUrl } from 'helper';
import { useAppTranslation } from 'hooks';
import { BodyText, Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { colors, elevations, globalFocusShadow } from 'components/common';
import { BaseTheme, DarkTheme } from 'styles/Theme';
import { RouterLinkRenderer } from 'components/common/Navigation/Link';

interface EngagementTileProps {
    passedEngagement?: Engagement;
    engagementId: number;
}
const EngagementTile = ({ passedEngagement, engagementId }: EngagementTileProps) => {
    const { t: translate } = useAppTranslation();
    const [loadedEngagement, setLoadedEngagement] = useState<Engagement | null>(passedEngagement || null);
    const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
    const [slug, setSlug] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const startDate = dayjs(loadedEngagement?.start_date);
    const endDate = dayjs(loadedEngagement?.end_date);
    const dateFormat = 'MMMM DD, YYYY';
    const semanticDateFormat = 'YYYY-MM-DD';
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const engagementPath = `/new-look/${slug}`;
    const engagementUrl = `${getBaseUrl()}${engagementPath}${languagePath}`;

    const loadEngagement = async () => {
        if (passedEngagement) {
            setIsLoadingEngagement(false);
            setLoadedEngagement(passedEngagement);
            return;
        }

        if (!engagementId) {
            setIsLoadingEngagement(false);
            return;
        }

        try {
            const engagement = await getEngagement(engagementId);
            setLoadedEngagement(engagement);
            setIsLoadingEngagement(false);
        } catch (error) {
            setIsLoadingEngagement(false);
        }
    };
    useEffect(() => {
        loadEngagement();
    }, [passedEngagement, engagementId]);

    const loadSlug = async () => {
        if (!loadedEngagement) {
            return;
        }
        try {
            const response = await getSlugByEngagementId(loadedEngagement.id);
            setSlug(response.slug);
        } catch (error) {
            setSlug('');
        }
    };

    useEffect(() => {
        loadSlug();
    }, [loadedEngagement]);

    if (isLoadingEngagement) {
        return <TileSkeleton />;
    }

    if (!loadedEngagement) {
        return <BodyText size="large">{translate('landingPage.tile.error')}</BodyText>;
    }

    const { name, banner_url } = loadedEngagement;

    return (
        <ThemeProvider theme={isHovered || isFocused ? DarkTheme : BaseTheme}>
            <Card
                className={isActive ? 'active' : ''}
                sx={{
                    borderRadius: '24px',
                    width: '320px',
                    cursor: 'pointer',
                    '&:hover, &:has(:hover)': {
                        boxShadow: elevations.hover,
                        background: colors.surface.blue[90],
                    },
                    '&:focus, &:has(:focus)': {
                        boxShadow: elevations.hover,
                        background: colors.surface.blue[90],
                    },
                    '&:focus-visible, &:has(:focus-visible)': {
                        boxShadow: [globalFocusShadow, elevations.hover].join(','),
                        '& .MuiCardMedia-root': {
                            borderRadius: '24px 24px 0px 0px',
                            boxShadow: globalFocusShadow,
                        },
                        outline: `2px solid ${colors.focus.regular.outer}`,
                        background: colors.surface.blue[90],
                    },
                    '&.active': {
                        boxShadow: elevations.pressed,
                        '&:focus-visible, &:has(:focus-visible)': {
                            boxShadow: [globalFocusShadow, elevations.pressed].join(','),
                        },
                        background: colors.surface.blue[100],
                    },
                }}
            >
                <CardActionArea
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setIsActive(false);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onMouseDown={() => setIsActive(true)}
                    onMouseUp={() => setIsActive(false)}
                    LinkComponent={RouterLinkRenderer}
                    href={engagementUrl}
                    sx={{
                        '&:focus-visible': {
                            // focus visible styling is applied by the parent Card component
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            padding: 'unset',
                            margin: 'unset',
                        },
                    }}
                >
                    {Boolean(banner_url) && <CardMedia sx={{ height: '172px' }} image={banner_url} />}
                    <CardContent sx={{ height: '260px', p: '40px 32px' }}>
                        <Box
                            sx={{
                                height: '96px',
                                mb: '32px',
                                width: '100%',
                                display: 'flex',
                            }}
                        >
                            <Header2
                                weight="thin"
                                component="p"
                                sx={{
                                    // Required for multi-line text truncation
                                    // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
                                    // Works on: Chrome, Firefox, Safari, Opera, Edge
                                    // On unsupported browsers, displays as 3 lines with no ellipsis
                                    flexGrow: 1,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    '-webkit-line-clamp': '3',
                                    '-webkit-box-orient': 'vertical',
                                    m: 0,
                                    lineHeight: 'normal',
                                }}
                            >
                                {name}
                                <FontAwesomeIcon
                                    style={{ flexGrow: 0, whiteSpace: 'nowrap', marginLeft: '8px' }}
                                    icon={faArrowRight}
                                />
                            </Header2>
                        </Box>
                        <Grid container flexDirection="row" alignItems="flex-start" columnSpacing={2}>
                            <Grid item xs="auto" alignContent={'flex-start'} alignItems={'flex-start'}>
                                <EngagementStatusChip statusId={loadedEngagement.submission_status} />
                            </Grid>
                            <Grid item xs container flexDirection="column">
                                <BodyText bold size="small" sx={{ lineHeight: 1 }}>
                                    <time dateTime={`${startDate.format(semanticDateFormat)}`}>
                                        {startDate.format(dateFormat)}
                                    </time>{' '}
                                    to
                                </BodyText>
                                <BodyText bold size="small" sx={{ lineHeight: 2 }}>
                                    <time dateTime={`${endDate.format(semanticDateFormat)}`}>
                                        {endDate.format(dateFormat)}
                                    </time>
                                </BodyText>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </ThemeProvider>
    );
};

export default EngagementTile;
