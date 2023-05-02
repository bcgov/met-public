import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Engagement } from 'models/engagement';
import { Box, Stack } from '@mui/material';
import { MetBody, MetHeader4, MetLabel, MetParagraph, PrimaryButton, SecondaryButton } from 'components/common';
import { getEngagement } from 'services/engagementService';
import { Else, If, Then, When } from 'react-if';
import dayjs from 'dayjs';
import { HomepageEngagementStatusChip } from 'components/engagement/status';
import { SubmissionStatus } from 'constants/engagementStatus';
import { TileSkeleton } from './TileSkeleton';
import { AppConfig } from 'config';

interface EngagementTileProps {
    passedEngagement?: Engagement;
    engagementId: number;
}
const EngagementTile = ({ passedEngagement, engagementId }: EngagementTileProps) => {
    const [loadedEngagement, setLoadedEngagement] = useState<Engagement | null>(passedEngagement || null);
    const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
    const dateFormat = 'MMM DD, YYYY';

    const baseUrl = AppConfig.publicUrl ? AppConfig.publicUrl : window.location.origin;
    const engagementUrl = loadedEngagement ? `${baseUrl}/engagements/${loadedEngagement.id}/view` : null;

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
        return <TileSkeleton />;
    }

    if (!loadedEngagement) {
        return <MetLabel>error Loading</MetLabel>;
    }

    const { name, end_date, start_date, description, status_id, banner_url } = loadedEngagement;
    const EngagementDate = `${dayjs(start_date).format(dateFormat)} to ${dayjs(end_date).format(dateFormat)}`;
    return (
        <Card sx={{ maxWidth: 345 }}>
            <When condition={Boolean(banner_url)}>
                <CardMedia sx={{ height: 140 }} image={banner_url} title={name} />
            </When>
            <CardContent>
                <Box sx={{ height: 200 }}>
                    <MetHeader4>{name}</MetHeader4>
                    <MetParagraph
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: '6',
                            WebkitBoxOrient: 'vertical',
                        }}
                        mt="0.5em"
                    >
                        {description}
                    </MetParagraph>
                </Box>
                <MetBody bold mt="1em">
                    {EngagementDate}
                </MetBody>
                <Stack direction="row" alignItems={'center'} spacing={1} mt="0.5em">
                    <MetBody bold>Status:</MetBody>
                    <HomepageEngagementStatusChip engagement={loadedEngagement} />
                </Stack>
            </CardContent>
            <CardActions>
                <If condition={status_id === SubmissionStatus.Open}>
                    <Then>
                        <PrimaryButton
                            fullWidth
                            onClick={() => {
                                if (!engagementUrl) {
                                    return;
                                }
                                window.open(engagementUrl, '_blank');
                            }}
                            disabled={!engagementUrl}
                        >
                            Share your thoughts
                        </PrimaryButton>
                    </Then>
                    <Else>
                        <SecondaryButton
                            fullWidth
                            onClick={() => {
                                if (!engagementUrl) {
                                    return;
                                }
                                window.open(engagementUrl, '_blank');
                            }}
                            disabled={!engagementUrl}
                        >
                            View Engagement
                        </SecondaryButton>
                    </Else>
                </If>
            </CardActions>
        </Card>
    );
};

export default EngagementTile;
