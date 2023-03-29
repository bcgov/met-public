import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';

const TileBlock = () => {
    const { engagements, loadingEngagements } = useContext(LandingContext);

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
        </Grid>
    );
};

export default TileBlock;
