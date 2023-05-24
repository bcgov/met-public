import React, { useContext, useEffect } from 'react';
import { Grid, Link as MuiLink, useMediaQuery, Stack, Theme, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MetHeader1, MetPaper, PrimaryButton, SecondaryButton } from 'components/common';
import { ReportBanner } from './ReportBanner';
import SurveysCompleted from './KPI/SurveysCompleted';
import ProjectLocation from './KPI/ProjectLocation';
import SurveyEmailsSent from './KPI/SurveyEmailsSent';
import SubmissionTrend from './SubmissionTrend/SubmissionTrend';
import { DashboardContext } from './DashboardContext';
import SurveyBar from './SurveyBar.tsx';
import SurveyBarPrintable from './SurveyBarPrintable';
import { generateDashboardPdf } from './util';

export const Dashboard = () => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { engagement, isEngagementLoading } = useContext(DashboardContext);
    const [isPrinting, setIsPrinting] = React.useState(false);

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
    };

    useEffect(() => {
        if (isPrinting) {
            generateDashboardPdf(() => setIsPrinting(false));
        }
    }, [isPrinting]);

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
                                <Stack direction="row" spacing={1}>
                                    <PrimaryButton
                                        data-testid="SurveyBlock/take-me-to-survey-button"
                                        onClick={handleReadComments}
                                    >
                                        Read Comments
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => {
                                            setIsPrinting(true);
                                        }}
                                        loading={isPrinting}
                                    >
                                        Export to PDF
                                    </SecondaryButton>
                                </Stack>
                            </Grid>
                            <Grid
                                id={'kpi'}
                                ml={isSmallScreen ? 0 : 2}
                                container
                                spacing={isSmallScreen ? 0 : 3}
                                item
                                xs={12}
                            >
                                <Grid item xs={12} sm={4}>
                                    <SurveyEmailsSent
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <SurveysCompleted
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ProjectLocation
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </Grid>
                            </Grid>
                            <Grid id={'submissiontrend'} ml={isSmallScreen ? 0 : 5} item xs={12}>
                                <SubmissionTrend engagement={engagement} engagementIsLoading={isEngagementLoading} />
                            </Grid>
                            <Grid item xs={12}>
                                <Box id={'surveybarprintable'} sx={{ display: isPrinting ? 'block' : 'none' }}>
                                    <SurveyBarPrintable
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </Box>
                                <SurveyBar engagement={engagement} engagementIsLoading={isEngagementLoading} />
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};
