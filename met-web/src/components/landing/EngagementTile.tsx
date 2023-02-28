import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Engagement } from 'models/engagement';
import { Skeleton } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { MetHeader4, MetLabel, MetParagraph, PrimaryButton } from 'components/common';
import { getEngagement } from 'services/engagementService';
import { When } from 'react-if';

interface EngagementTileProps {
    passedEngagement?: Engagement;
    engagementId: number;
}
const EngagementTile = ({ passedEngagement, engagementId }: EngagementTileProps) => {
    const [loadedEngagement, setLoadedEngagement] = useState<Engagement | null>(passedEngagement || null);
    const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
    const dispatch = useAppDispatch();

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

    if (isLoadingEngagement) {
        return <Skeleton variant="rectangular" height="10em" />;
    }

    if (!loadedEngagement) {
        return <MetLabel>error Loading</MetLabel>;
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <When condition={Boolean(loadedEngagement.banner_url)}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={loadedEngagement.banner_url}
                    title={loadedEngagement.banner_filename}
                />
            </When>
            <CardContent>
                <MetHeader4>{loadedEngagement.name}</MetHeader4>
                <MetParagraph overflow="hidden" textOverflow={'ellipsis'} maxHeight={200}>
                    {loadedEngagement.description}
                </MetParagraph>
            </CardContent>
            <CardActions>
                <PrimaryButton fullWidth size="small">
                    Share your thoughts
                </PrimaryButton>
            </CardActions>
        </Card>
    );
};

export default EngagementTile;
