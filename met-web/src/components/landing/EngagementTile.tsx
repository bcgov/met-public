import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Engagement } from 'models/engagement';
import { Box, Stack } from '@mui/material';
import { MetBodyOld, MetHeader4, MetLabel, MetParagraphOld } from 'components/common';
import { getEngagement } from 'services/engagementService';
import { If, Then, When } from 'react-if';
import dayjs from 'dayjs';
import { EngagementStatusChip } from 'components/engagement/status';
import { SubmissionStatus } from 'constants/engagementStatus';
import { TileSkeleton } from './TileSkeleton';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { getBaseUrl } from 'helper';
import { useAppTranslation } from 'hooks';
import { Button } from 'components/common/Input/Button';

interface EngagementTileProps {
    passedEngagement?: Engagement;
    engagementId: number;
}
const EngagementTile = ({ passedEngagement, engagementId }: EngagementTileProps) => {
    const { t: translate } = useAppTranslation();
    const [loadedEngagement, setLoadedEngagement] = useState<Engagement | null>(passedEngagement || null);
    const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
    const [slug, setSlug] = useState('');
    const dateFormat = 'MMM DD, YYYY';
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const engagementPath = `/${slug}`;
    const engagementUrl = `${getBaseUrl()}${engagementPath}${languagePath}`;

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
        return <MetLabel>{translate('landingPage.tile.error')}</MetLabel>;
    }

    const { name, end_date, start_date, description, banner_url, submission_status } = loadedEngagement;
    const EngagementDate = `${dayjs(start_date).format(dateFormat)} to ${dayjs(end_date).format(dateFormat)}`;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        window.location.href = engagementUrl;
    };

    return (
        <Card
            aria-label={'Engagement Card of ' + name}
            sx={{
                maxWidth: 345,
                '&:hover': {
                    backgroundColor: 'var(--bcds-surface-secondary-hover)',
                    cursor: 'pointer',
                },
            }}
            tabIndex={0}
            role="article"
            onClick={() => {
                window.location.href = engagementUrl;
            }}
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    window.location.href = engagementUrl;
                }
            }}
        >
            <When condition={Boolean(banner_url)}>
                <CardMedia sx={{ height: 140 }} image={banner_url} role="img" title={name} aria-label={name} />
            </When>
            <CardContent>
                <Box sx={{ minHeight: 200 }}>
                    <div
                        style={{
                            fontSize: '1.3em',
                            fontWeight: 'bold',
                        }}
                    >
                        {name}
                    </div>
                    <MetParagraphOld
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
                    </MetParagraphOld>
                </Box>
                <MetBodyOld bold mt="1em" aria-label="Period of engagement is from">
                    {EngagementDate}
                </MetBodyOld>
                <Stack direction="row" alignItems={'center'} spacing={1} mt="0.5em">
                    <MetBodyOld bold>{translate('landingPage.tile.status')}</MetBodyOld>
                    <EngagementStatusChip submissionStatus={submission_status} />
                </Stack>
            </CardContent>
            <CardActions>
                <If condition={submission_status === SubmissionStatus.Open}>
                    <Then>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleClick as () => void}
                            aria-label={translate('buttonText.shareYourThoughts')}
                        >
                            {translate('buttonText.shareYourThoughts')}
                        </Button>
                    </Then>
                </If>
                <If
                    condition={
                        submission_status === SubmissionStatus.Closed || submission_status === SubmissionStatus.Upcoming
                    }
                >
                    <Then>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleClick as () => void}
                            aria-label={translate('buttonText.viewEngagement')}
                        >
                            {translate('buttonText.viewEngagement')}
                        </Button>
                    </Then>
                </If>
            </CardActions>
        </Card>
    );
};

export default EngagementTile;
