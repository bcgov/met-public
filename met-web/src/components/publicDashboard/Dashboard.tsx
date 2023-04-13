import React, { useContext } from 'react';
import { Grid, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MetHeader1, MetPaper, PrimaryButton } from 'components/common';
import { ReportBanner } from './ReportBanner';
import SurveyResult from './SurveyResult';
import CompleteResponses from './KPI/CompleteResponses';
import ResponsesWithComment from './KPI/ResponsesWithComment';
import TotalResponses from './KPI/TotalResponses';
import SubmissionTrend from './SubmissionTrend/SubmissionTrend';
import { DashboardContext } from './DashboardContext';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { engagement, isEngagementLoading } = useContext(DashboardContext);

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
        return;
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
                m={{ lg: '1em 8em 2em 3em', xs: '1em' }}
            >
                <Grid item xs={12} container justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagements/${engagement.id}/view`}>
                        {`<< Return to ${engagement.name} Engagement`}
                    </MuiLink>
                </Grid>

                <Grid container item xs={12}>
                    <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            rowSpacing={3}
                        >
                            <Grid item xs={12} sm={6}>
                                <MetHeader1>What We Heard</MetHeader1>
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
                                    <TotalResponses />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <CompleteResponses />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ResponsesWithComment />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <SubmissionTrend />
                            </Grid>
                            <Grid item xs={12}>
                                <SurveyResult />
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
