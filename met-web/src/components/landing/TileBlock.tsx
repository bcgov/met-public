import React, { useContext, useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';
import { PAGE_SIZE } from './constants';
import NoResult from 'routes/NoResults';
import { Pagination } from 'components/common/Input';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';

const TileBlock = () => {
    const { engagements, loadingEngagements, totalEngagements, page, setPage } = useContext(LandingContext);
    const [ariaStatusMessage, setAriaStatusMessage] = useState(`Results updated. ${totalEngagements} results`);

    useEffect(() => {
        setAriaStatusMessage(`${totalEngagements} results`);
    }, [totalEngagements]);

    if (loadingEngagements) {
        return (
            <Grid
                container
                direction="row"
                alignItems={'flex-start'}
                justifyContent="flex-start"
                columnSpacing={2}
                rowSpacing={4}
                item
                xs={10}
            >
                <RepeatedGrid times={4} item xs={12} sm={6} md={4} lg={3}>
                    <TileSkeleton />
                </RepeatedGrid>
            </Grid>
        );
    }
    return (
        <LiveAnnouncer>
            <LiveMessage message={ariaStatusMessage} aria-live="assertive" />
            {engagements.length === 0 ? (
                <Grid
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    columnSpacing={2}
                    rowSpacing={4}
                    item
                    xs={10}
                >
                    <NoResult />
                </Grid>
            ) : (
                <Grid
                    component="ul"
                    aria-label={`Engagements list. Browsing ${totalEngagements} results`}
                    container
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    columnSpacing={2}
                    rowSpacing={4}
                    item
                    role="region"
                    xs={10}
                >
                    {engagements.map((engagement) => {
                        return (
                            <Grid
                                component="li"
                                key={`Grid-${engagement.id}`}
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                container
                                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                                alignItems={{ xs: 'center', sm: 'flex-start' }}
                            >
                                <Grid item xs={12}>
                                    <EngagementTile passedEngagement={engagement} engagementId={engagement.id} />
                                </Grid>
                            </Grid>
                        );
                    })}
                    <Grid
                        item
                        xs={12}
                        container
                        direction="row"
                        alignItems={'center'}
                        justifyContent="center"
                        marginBottom="2em"
                    >
                        <Grid item>
                            <Pagination
                                defaultPage={1}
                                page={page}
                                count={Math.ceil(totalEngagements / PAGE_SIZE)}
                                color="primary"
                                showFirstButton
                                showLastButton
                                aria-label="Pagination"
                                onChange={(_, pageNumber) => setPage(pageNumber)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </LiveAnnouncer>
    );
};

export default TileBlock;
