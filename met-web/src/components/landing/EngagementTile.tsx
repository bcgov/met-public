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
import { EngagementStatusChip } from 'components/engagement/status';
import { SubmissionStatus } from 'constants/engagementStatus';
import { TileSkeleton } from './TileSkeleton';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getBaseUrl } from 'helper';

interface EngagementTileProps {
    passedEngagement?: Engagement;
    engagementId: number;
}
const EngagementTile = ({ passedEngagement, engagementId }: EngagementTileProps) => {
    const [loadedEngagement, setLoadedEngagement] = useState<Engagement | null>(passedEngagement || null);
    const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
    const [slug, setSlug] = useState('');
    const dateFormat = 'MMM DD, YYYY';
    const engagementPath = `/${slug}`;
    const engagementUrl = `${getBaseUrl()}${engagementPath}`;

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

    const loadSlug = async () => {
        if (!loadedEngagement) {
            return;
        }
        try {
            const response = await getSlugByEngagementId(loadedEngagement.id);
            setSlug(response.slug);
        } catch (error) {
            setSlug('');
        }
    };

    useEffect(() => {
        loadSlug();
    }, [loadedEngagement]);

    if (isLoadingEngagement) {
        return <TileSkeleton />;
    }

    if (!loadedEngagement) {
        return <MetLabel>error Loading</MetLabel>;
    }

    const { name, end_date, start_date, description, status_id, banner_url, submission_status } = loadedEngagement;
    const EngagementDate = `${dayjs(start_date).format(dateFormat)} to ${dayjs(end_date).format(dateFormat)}`;
    return (
        <Card
            sx={{
                maxWidth: 345,
                '&:hover': {
                    backgroundColor: '#F2F2F2',
                    cursor: 'pointer',
                    opacity: 0.5,
                },
            }}
            onClick={() => {
                window.open(engagementUrl, '_blank');
            }}
        >
            <When condition={Boolean(banner_url)}>
                <CardMedia sx={{ height: 140 }} image={banner_url} title={name} />
            </When>
            <CardContent>
                <Box sx={{ minHeight: 200 }}>
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
                    <EngagementStatusChip submissionStatus={submission_status} />
                </Stack>
            </CardContent>
            <CardActions>
                <If condition={status_id === SubmissionStatus.Open}>
                    <Then>
                        <PrimaryButton
                            fullWidth
                            onClick={(event: React.MouseEvent) => {
                                event.stopPropagation();
                                window.open(engagementUrl, '_blank');
                            }}
                        >
                            Share your thoughts
                        </PrimaryButton>
                    </Then>
                    <Else>
                        <SecondaryButton
                            fullWidth
                            onClick={(event: React.MouseEvent) => {
                                event.stopPropagation();
                                window.open(engagementUrl, '_blank');
                            }}
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
