import React, { useContext, useEffect } from 'react';
import { Grid, Link as MuiLink, useMediaQuery, Stack, Theme, Box, Backdrop } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgressWithLabel, MetHeader1, MetPaper, PrimaryButton, SecondaryButton } from 'components/common';
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
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
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
                                    item
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    ml={isSmallScreen ? 0 : 5}
                                    rowSpacing={3}
                                >
                                    <Grid id={'kpi'} container spacing={3} item xs={12}>
                                        <Grid id={'kpi-emails-sent'} item xs={12} sm={4}>
                                            <SurveyEmailsSent
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <Grid id={'kpi-surveys-completed'} item xs={12} sm={4}>
                                            <SurveysCompleted
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{ width: '100%' }}>
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
                                        <Box id={'surveybarprintable'} sx={{ display: isPrinting ? 'block' : 'none' }}>
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
