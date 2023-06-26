import React, { useEffect, useState } from 'react';
import { Grid, Link as MuiLink, Skeleton } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppConfig } from 'config';
import { MetHeader1, MetPaper, PrimaryButton } from 'components/common';
import { ReportBanner } from './ReportBanner';
import { createDefaultEngagement, Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { getEngagement } from 'services/engagementService';
import { getErrorMessage } from 'utils';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppSelector, useAppDispatch } from 'hooks';

export type EngagementParams = {
    engagementId: string;
};

export const EngagementDashboard = () => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const urlpath = AppConfig.redashDashboardUrl;
    const roles = useAppSelector((state) => state.user.roles);

    const [engagement, setEngagement] = useState<Engagement>(createDefaultEngagement());
    const [isEngagementLoading, setEngagementLoading] = useState(true);

    const failIfInvalidEngagement = (engagementToValidate: Engagement) => {
        // submission status e.g. of pending or draft will have id less than of Open
        const neverOpened = [SubmissionStatus.Upcoming].includes(engagementToValidate?.submission_status);

        if (neverOpened) {
            throw new Error('Engagement has not yet been opened');
        }
    };

    const validateEngagement = (engagementToValidate: Engagement) => {
        const isClosed = engagementToValidate?.submission_status === SubmissionStatus.Closed;
        const canAccessDashboard = !roles.includes('access_dashboard');

        /* check to ensure that users without the role access_dashboard can access the dashboard only after 
        the engagement is closed*/
        if (!isClosed && canAccessDashboard) {
            throw new Error('Engagement is not yet closed');
        }
    };

    useEffect(() => {
        const fetchEngagement = async () => {
            if (isNaN(Number(engagementId))) {
                navigate('/not-found');
                return;
            }
            try {
                const result = await getEngagement(Number(engagementId));
                failIfInvalidEngagement(result);
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
            }
        };
        fetchEngagement();
    }, [engagementId]);

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
        return;
    };

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
                    <MuiLink component={Link} to={`/engagements/${engagement.id}/view`}>
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
                                <MetHeader1>What We Heard - {engagement.name}</MetHeader1>
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
                                    onClick={handleReadComments}
                                >
                                    Read Comments
                                </PrimaryButton>
                            </Grid>
                            <Grid item xs={12}>
                                <iframe
                                    style={{ width: '100%', height: '1310px', overflow: 'scroll', border: 'none' }}
                                    src={`${urlpath}${engagement.id}`}
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
