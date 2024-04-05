import React, { useContext } from 'react';
import { Grid, Pagination } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import EngagementTile from './EngagementTile';
import { LandingContext } from './LandingContext';
import { PAGE_SIZE } from './constants';

const TileBlock = () => {
    const { engagements, loadingEngagements, totalEngagements, page, setPage } = useContext(LandingContext);

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
        <Grid
            container
            direction="row"
            justifyContent={'flex-start'}
            alignItems="flex-start"
            columnSpacing={2}
            rowSpacing={4}
            item
            xs={10}
        >
            {engagements.map((engagement) => {
                return (
                    <Grid
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
                        onChange={(_, pageNumber) => setPage(pageNumber)}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TileBlock;
