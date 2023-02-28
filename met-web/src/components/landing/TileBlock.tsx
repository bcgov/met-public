import React, { useEffect, useState } from 'react';
import { Engagement } from 'models/engagement';
import { Grid } from '@mui/material';
import { RepeatedGrid } from 'components/common';
import { TileSkeleton } from './TileSkeleton';
import { getEngagements } from 'services/engagementService';
import EngagementTile from './EngagementTile';

const TileBlock = () => {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [loadingEngagements, setLoadingEngagements] = useState(true);

    const loadEngagements = async () => {
        try {
            const loadedEngagements = await getEngagements({
                page: 1,
                size: 50,
                sort_key: 'engagement.created_date',
                sort_order: 'desc',
                include_banner_url: true,
            });
            setEngagements(loadedEngagements.items);
            setLoadingEngagements(false);
        } catch (error) {}
    };

    useEffect(() => {
        loadEngagements();
    }, []);

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
        <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
            {engagements.map((engagement) => {
                return (
                    <Grid key={`Grid-${engagement.id}`} item xs={4}>
                        <EngagementTile passedEngagement={engagement} engagementId={engagement.id} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default TileBlock;
