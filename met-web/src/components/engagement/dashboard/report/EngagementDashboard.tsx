import React, { useEffect, useState } from 'react';
import { Grid, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppConfig } from 'config';
import { MetPaper, PrimaryButton } from 'components/common';
import { ReportBanner } from './ReportBanner';
import { createDefaultEngagement, Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { getEngagement } from 'services/engagementService';
import { getErrorMessage } from 'utils';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';

export type EngagementParams = {
    engagementId: string;
};

export const EngagementDashboard = () => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const urlpath = AppConfig.redashDashboardUrl;

    const [engagement, setEngagement] = useState<Engagement>(createDefaultEngagement());
    const [isEngagementLoading, setEngagementLoading] = useState(true);

    const validateEngagement = (engagementToValidate: Engagement) => {
        const isOpen = engagementToValidate?.submission_status === SubmissionStatus.Open;

        if (!isOpen) {
            throw new Error('Engagement is not yet open');
        }
    };
    useEffect(() => {
        const fetchEngagement = async () => {
            if (isNaN(Number(engagementId))) {
                navigate('/');
                return;
            }
            try {
                const result = await getEngagement(Number(engagementId));
                validateEngagement(result);
                setEngagement({ ...result });
                setEngagementLoading(false);
            } catch (error) {
                console.log(error);
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: getErrorMessage(error) || 'Error occurred while fetching Engagement information',
                    }),
                );
                navigate('/');
            }
        };
        fetchEngagement();
    }, [engagementId]);

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60m" />;
    }

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <ReportBanner engagement={engagement} isLoading={isEngagementLoading} />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-end'}
                alignItems="flex-end"
                m={{ lg: '1em 8em 2em 3em', xs: '1em' }}
            >
                <Grid item xs={12} container justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagement/view/${engagement.id}`}>
                        {`<< Return to ${engagement.name} Engagement`}
                    </MuiLink>
                </Grid>

                <Grid item xs={12}>
                    <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            rowSpacing={2}
                        >
                            <Grid item xs={12} sm={6}>
                                <Typography variant={'h4'}>What we heard</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                container
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="flex-end"
                            >
                                <PrimaryButton
                                    data-testid="SurveyBlock/take-me-to-survey-button"
                                    component={Link}
                                    to={`/engagement/${engagement.id}/comments`}
                                >
                                    Read Comments
                                </PrimaryButton>
                            </Grid>
                            <Grid item xs={12}>
                                <iframe
                                    style={{ width: '100%', height: '1310px', overflow: 'scroll', border: 'none' }}
                                    src={`${urlpath}${engagement.name}`}
                                ></iframe>
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default EngagementDashboard;
