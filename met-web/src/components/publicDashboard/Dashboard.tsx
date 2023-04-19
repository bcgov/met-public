import React, { useContext } from 'react';
import { Grid, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MetHeader1, MetPaper, PrimaryButton } from 'components/common';
import { ReportBanner } from './ReportBanner';
import CompleteResponsesGauge from './KPI/CompleteResponsesGauge';
import ResponsesWithCommentGauge from './KPI/ResponsesWithCommentGauge';
import TotalResponsesGauge from './KPI/TotalResponsesGauge';
import SubmissionTrend from './SubmissionTrend/SubmissionTrend';
import { DashboardContext } from './DashboardContext';
import SurveyBar from './SurveyBar.tsx';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { engagement, isEngagementLoading } = useContext(DashboardContext);

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
    };

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
                m={{ lg: '1em 8em 2em 3em', sm: '2em', xs: '0.5em' }}
            >
                <Grid item xs={12} container justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagements/${engagement.id}/view`}>
                        {`<< Return to ${engagement.name} Engagement`}
                    </MuiLink>
                </Grid>

                <Grid container item xs={12}>
                    <MetPaper elevation={1} sx={{ padding: { md: '2em 2em 0 2em', sm: '1em', xs: '0.5em' } }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            rowSpacing={3}
                            sx={{ marginBottom: '2em' }}
                        >
                            <Grid item xs={12} sm={6}>
                                <MetHeader1 textAlign={{ xs: 'center', sm: 'left' }}>What We Heard</MetHeader1>
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
                            <Grid container spacing={3} item xs={12}>
                                <Grid item xs={12} sm={4}>
                                    <TotalResponsesGauge />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <CompleteResponsesGauge />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ResponsesWithCommentGauge />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <SubmissionTrend />
                            </Grid>
                            <Grid item xs={12}>
                                <SurveyBar />
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
