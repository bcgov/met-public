import React, { useEffect } from 'react';
import { Box, Grid, MobileStepper, ThemeProvider } from '@mui/material';
import { TileSkeleton } from 'components/landing/TileSkeleton';
import { getEngagements } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import EngagementTile from 'components/landing/EngagementTile';
import { RepeatedGrid } from 'components/common';
import { Header2 } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Button } from 'components/common/Input';
import { Link } from 'components/common/Navigation';
import { useLoaderData } from 'react-router-dom';
import { engagementMetadata } from '../../../../../tests/unit/components/factory';

export const SuggestedEngagements = () => {
    const [suggestedEngagements, setSuggestedEngagements] = React.useState([] as Engagement[]);
    const [totalEngagements, setTotalEngagements] = React.useState(3);
    const [page, setPage] = React.useState(0);
    const [pageLength, setPageLength] = React.useState(3);
    const [isLoading, setIsLoading] = React.useState(true);
    const { engagement } = useLoaderData() as { engagement: Promise<Engagement> };
    const allEngagementsPromise = getEngagements({ size: 13, page: 1, include_banner_url: true });

    const handleResize = () => {
        if (window.innerWidth < 930) {
            setPageLength(1);
        } else if (window.innerWidth < 1500) {
            setPageLength(2);
            if (page > 5) {
                setPage(5);
            }
        } else if (window.innerWidth < 1800) {
            setPageLength(3);
            if (page > 3) {
                setPage(3);
            }
        } else {
            setPageLength(4);
            if (page > 4) {
                setPage(4);
            }
        }
    };
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // preload all 12 suggested engagements to keep things snappy
                // a 13th engagement is loaded in case one of the 12 is the current engagement
                const currentEngagement = await engagement;
                const allEngagements = await allEngagementsPromise;
                const filteredEngagements = allEngagements.items
                    .filter((engagement) => engagement.id !== currentEngagement.id)
                    .slice(0, 12)
                    .map((value) => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value);
                setSuggestedEngagements(filteredEngagements);
                setTotalEngagements(allEngagements.total);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching suggested engagements:', error);
            }
        };
        setPage(0);
        fetchData();
    }, [engagement]);

    const pages = Math.ceil((totalEngagements - 1) / pageLength);
    const engagementSlice = suggestedEngagements.slice(page * pageLength, (page + 1) * pageLength);

    return (
        <section id="suggested-engagements" aria-labelledby="suggested-engagements-header">
            <Box sx={{ padding: { xs: '43px 16px 24px 16px', md: '32px 5vw 40px 5vw', lg: '32px 156px 40px 156px' } }}>
                <Header2 weight="thin" decorated id="suggested-engagements-header">
                    You may also be interested in
                </Header2>
                <Grid container justifyContent="center" alignItems={'center'} direction={'row'}>
                    <Button variant="tertiary" disabled={page < 1} onClick={() => setPage(Math.max(page - 1, 0))}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <RepeatedGrid
                                  times={pageLength - 1}
                                  item
                                  width="320px"
                                  margin="0 16px"
                                  sx={{
                                      flexBasis: '320px',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                  }}
                              >
                                  <TileSkeleton />
                              </RepeatedGrid>
                          ))
                        : engagementSlice.map((engagement, index) => (
                              <Grid item width="320px" margin="0 16px" key={engagement.id}>
                                  <EngagementTile passedEngagement={engagement} engagementId={engagement.id} />
                              </Grid>
                          ))}
                    <Button
                        variant="tertiary"
                        disabled={page > pages - 2}
                        onClick={() => setPage(Math.min(page + 1, pages - 1))}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                    <Grid item mt="32px" xs={12} alignContent={'center'}>
                        <MobileStepper
                            variant="dots"
                            position="static"
                            steps={pages}
                            activeStep={page}
                            backButton={null}
                            nextButton={null}
                            sx={{
                                width: '100%',
                                flexGrow: 1,
                                justifyContent: 'center',
                                '& .MuiMobileStepper-dot': {
                                    margin: { md: '0 4px', lg: '0 16px' },
                                    border: '1px solid',
                                    bordercolor: 'transparent',
                                    '&:not(.MuiMobileStepper-dotActive)': {
                                        background: 'transparent',
                                        borderColor: (theme) => theme.palette.primary.main as string,
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} mt="24px" textAlign={'center'}>
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
