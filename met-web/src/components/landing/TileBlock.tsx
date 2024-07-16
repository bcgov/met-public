import React, { useContext, useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';
import NoResult from 'routes/NoResults';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import { Pagination } from 'components/common/Input';
import { PAGE_SIZE } from './constants';

const TileBlock = () => {
    const { engagements, loadingEngagements, page, setPage, totalEngagements } = useContext(LandingContext);
    const [ariaStatusMessage, setAriaStatusMessage] = useState(`Results updated. ${totalEngagements} results`);

    useEffect(() => {
        setAriaStatusMessage(`${totalEngagements} results`);
    }, [totalEngagements]);

    if (loadingEngagements) {
        return (
            <Grid
                container
                direction="row"
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                columnSpacing={5}
                rowSpacing={4}
                item
                xs={10}
            >
                <RepeatedGrid
                    times={8}
                    item
                    container
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    sx={{
                        flexBasis: '320px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TileSkeleton />
                </RepeatedGrid>
            </Grid>
        );
    }
    if (engagements.length == 0) {
        return (
            <Grid
                container
                direction="row"
                justifyContent={'space-between'}
                alignItems="flex-start"
                columnSpacing={{ xs: 0, sm: 2 }}
                rowSpacing={4}
                item
                xs={10}
            >
                <NoResult />
                <ul aria-label="Engagements list. No results."></ul>
            </Grid>
        );
    }
    return (
        <LiveAnnouncer>
            <LiveMessage message={ariaStatusMessage} aria-live="assertive" />
            <Grid
                container
                component="ul"
                aria-label={`Engagements list. ${totalEngagements} results.`}
                direction="row"
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                columnSpacing={5}
                rowSpacing={4}
                item
                xs={10}
            >
                {engagements.map((engagement) => {
                    return (
                        <Grid
                            component="li"
                            item
                            container
                            key={engagement.id}
                            xs={12}
                            md={6}
                            lg={4}
                            xl={3}
                            sx={{
                                flexBasis: '320px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                listStyleType: 'none',
                            }}
                        >
                            <Grid item width="320px">
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
                            onChange={(_, pageNumber) => setPage(pageNumber)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </LiveAnnouncer>
    );
};

export default TileBlock;
