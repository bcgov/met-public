import React, { useContext, useEffect, useRef, useState } from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { MetHeader1, MetLabel, MetParagraph } from 'components/common';
import TileBlock from './TileBlock';
import { debounce } from 'lodash';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { LandingContext } from './LandingContext';
import { Container } from '@mui/system';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { useAppTranslation } from 'hooks';

const LandingComponent = () => {
    const { searchFilters, setSearchFilters, setPage, page } = useContext(LandingContext);
    const [didMount, setDidMount] = useState(false);
    const { t: translate } = useAppTranslation();

    const debounceSetSearchFilters = useRef(
        debounce((searchText: string) => {
            setSearchFilters({
                ...searchFilters,
                name: searchText,
            });
        }, 300),
    ).current;

    const tileBlockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    }, []);

    useEffect(() => {
        if (didMount) {
            const yOffset = tileBlockRef?.current?.offsetTop;
            window.scrollTo({ top: yOffset || 0, behavior: 'smooth' });
        }
    }, [page]);

    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid item xs={12}>
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
                            item
                            lg={6}
                            sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                padding: '1em',
                                pt: 0,
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12}>
                                <MetHeader1>{translate('landing.banner.header')}</MetHeader1>
                            </Grid>
                            <Grid item xs={12}>
                                <MetParagraph>{translate('landing.banner.description')}</MetParagraph>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>

            <Container maxWidth={false} sx={{ maxWidth: '1700px' }}>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'center'}
                    alignItems="center"
                    rowSpacing={3}
                >
                    <Grid
                        container
                        item
                        xs={10}
                        justifyContent={'flex-start'}
                        alignItems="flex-start"
                        columnSpacing={2}
                        rowSpacing={4}
                        marginTop={'2em'}
                        ref={tileBlockRef}
                    >
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <MetLabel>Engagement name</MetLabel>
                            <TextField
                                fullWidth
                                placeholder="Type engagement's name..."
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                onChange={(event) => {
                                    debounceSetSearchFilters(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <MetLabel>Status</MetLabel>
                            <TextField
                                id="status"
                                name="status"
                                variant="outlined"
                                label=" "
                                defaultValue=""
                                value={searchFilters.status}
                                fullWidth
                                size="small"
                                onChange={(event) => {
                                    setSearchFilters({
                                        ...searchFilters,
                                        status: event.target.value ? [Number(event.target.value)] : [],
                                    });
                                    setPage(1);
                                }}
                                select
                                InputLabelProps={{
                                    shrink: false,
                                }}
                            >
                                <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                                    {''}
                                </MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Open}>Open</MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Upcoming}>Upcoming</MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Closed}>Closed</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid item xs={10} container justifyContent={'center'} alignItems="center">
                        <TileBlock />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
};

export default LandingComponent;
