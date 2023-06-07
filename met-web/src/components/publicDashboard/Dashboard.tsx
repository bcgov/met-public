import React, { useContext, useEffect } from 'react';
import { Grid, Link as MuiLink, useMediaQuery, Stack, Theme, Box, Backdrop } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
    CircularProgressWithLabel,
    MetHeader1,
    MetPaper,
    MetDescription,
    PrimaryButton,
    SecondaryButton,
} from 'components/common';
import { ReportBanner } from './ReportBanner';
import SurveysCompleted from './KPI/SurveysCompleted';
import ProjectLocation from './KPI/ProjectLocation';
import SurveyEmailsSent from './KPI/SurveyEmailsSent';
import SubmissionTrend from './SubmissionTrend/SubmissionTrend';
import { DashboardContext } from './DashboardContext';
import SurveyBar from './SurveyBar';
import SurveyBarPrintable from './SurveyBarPrintable';
import { generateDashboardPdf } from './util';
import { Map } from 'models/analytics/map';
import { When } from 'react-if';

const Dashboard = () => {
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { engagement, isEngagementLoading } = useContext(DashboardContext);
    const [isPrinting, setIsPrinting] = React.useState(false);
    const [projectMapData, setProjectMapData] = React.useState<Map | null>(null);
    const [pdfExportProgress, setPdfExportProgress] = React.useState(0);

    const handleProjetMapData = (data: Map) => {
        setProjectMapData(data);
    };

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
    };

    const handlePdfExportProgress = (progress: number) => {
        setPdfExportProgress(progress);
    };

    const handleGenerateDashboardPdf = () => {
        generateDashboardPdf(projectMapData, handlePdfExportProgress)
            .then(() => {
                // Success callback
                setIsPrinting(false);
            })
            .catch((error) => {
                // Error handling
                console.error('Error generating dashboard PDF:', error);
            });
    };

    useEffect(() => {
        if (isPrinting) {
            handleGenerateDashboardPdf();
        }
    }, [isPrinting]);

    return (
        <>
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
                        <MetPaper elevation={1} sx={{ padding: { md: '2em 2em 1em 2em', sm: '1em', xs: '0.5em' } }}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                rowSpacing={3}
                            >
                                <When condition={!isTablet}>
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
                                </When>
                                <Grid
                                    container
                                    spacing={isTablet ? 0 : 3}
                                    rowSpacing={isTablet ? 1 : 3}
                                    item
                                    xs={12}
                                    ml={isTablet ? 0 : 2}
                                >
                                    <Grid
                                        id={'kpi'}
                                        container
                                        spacing={1}
                                        item
                                        alignItems={'space-evenly'}
                                        justifyContent={'space-evenly'}
                                        xs={12}
                                    >
                                        <When condition={isTablet}>
                                            <Grid item container sm={12}>
                                                <Grid
                                                    item
                                                    container
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                    xs={12}
                                                    sx={{ mb: 1 }}
                                                >
                                                    <MetHeader1 bold>{engagement.name}</MetHeader1>
                                                </Grid>
                                                <Grid
                                                    item
                                                    container
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                    xs={12}
                                                >
                                                    <Grid item>
                                                        <MetDescription sx={{ mr: 1 }}>
                                                            From: {engagement.start_date}{' '}
                                                        </MetDescription>
                                                    </Grid>
                                                    <Grid item>
                                                        <MetDescription>To: {engagement.end_date}</MetDescription>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </When>
                                        <Grid item sm={4}>
                                            <SurveyEmailsSent
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <Grid id={'kpi-surveys-completed'} item sm={4}>
                                            <SurveysCompleted
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <Grid item sm={8} md={4} sx={{ width: isTablet ? '90%' : '100%' }}>
                                            <ProjectLocation
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                                handleProjetMapData={handleProjetMapData}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid id={'submissiontrend'} item xs={12}>
                                        <SubmissionTrend
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box
                                            id={'surveybarprintable'}
                                            sx={{ border: '2px solid red', display: isPrinting ? 'block' : 'none' }}
                                        >
                                            <SurveyBarPrintable
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Box>
                                        <SurveyBar
                                            readComments={handleReadComments}
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                        />
                                    </Grid>
                                    <When condition={isPrinting}>
                                        <Grid item xs={12}>
                                            <Box
                                                id={'printableMapContainer'}
                                                sx={{
                                                    height: '300px',
                                                    width: '300px',
                                                }}
                                            ></Box>
                                        </Grid>
                                    </When>
                                </Grid>
                            </Grid>
                        </MetPaper>
                    </Grid>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isPrinting}
                onExit={() => {
                    setPdfExportProgress(100);
                }}
                onExited={() => {
                    setPdfExportProgress(0);
                }}
            >
                <CircularProgressWithLabel value={pdfExportProgress} />
            </Backdrop>
        </>
    );
};

export default Dashboard;
