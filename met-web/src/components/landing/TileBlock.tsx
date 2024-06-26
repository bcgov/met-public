import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';
import { PAGE_SIZE } from './constants';
import NoResult from 'routes/NoResults';
import { Pagination } from 'components/common/Input';

const TileBlock = () => {
    const { engagements, loadingEngagements, totalEngagements, page, setPage } = useContext(LandingContext);

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
            </Grid>
        );
    }
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
            {engagements.map((engagement, index) => {
                return (
                    <Grid
                        key={`Grid-${engagement.id}`}
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
    );
};

export default TileBlock;
