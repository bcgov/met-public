import React, { useContext } from 'react';
import { Grid, Pagination } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';
import { When } from 'react-if';
import { PAGE_SIZE } from './constants';
import { TilePlaceholder } from './TilePlaceholder';

const TileBlock = () => {
    const { engagements, loadingEngagements, totalEngagements, page, setPage } = useContext(LandingContext);

    if (loadingEngagements) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <RepeatedGrid times={4} item xs={3}>
                    <TileSkeleton />
                </RepeatedGrid>
            </Grid>
        );
    }
    return (
        <Grid
            container
            direction="row"
            alignItems={'flex-start'}
            justifyContent="flex-start"
            columnSpacing={2}
            rowSpacing={4}
        >
            {engagements.map((engagement) => {
                return (
                    <Grid key={`Grid-${engagement.id}`} item xs={12} sm={6} md={4} lg={3}>
                        <EngagementTile passedEngagement={engagement} engagementId={engagement.id} />
                    </Grid>
                );
            })}
            <When condition={PAGE_SIZE - engagements.length > 0}>
                <RepeatedGrid times={PAGE_SIZE - engagements.length} item xs={12} sm={6} md={4} lg={3}>
                    <TilePlaceholder />
                </RepeatedGrid>
            </When>
            <Grid item xs={12} container direction="row" alignItems={'center'} justifyContent="center">
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
