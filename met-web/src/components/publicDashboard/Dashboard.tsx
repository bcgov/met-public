import React, { useContext, useEffect } from 'react';
import { Grid, Link as MuiLink, useMediaQuery, Stack, Theme, Box, Backdrop } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { useAppSelector, useAppTranslation } from 'hooks';

const Dashboard = () => {
    const { t: translate } = useAppTranslation();
    const { slug } = useParams();
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { engagement, isEngagementLoading, dashboardType } = useContext(DashboardContext);
    const [isPrinting, setIsPrinting] = React.useState(false);
    const [projectMapData, setProjectMapData] = React.useState<Map | null>(null);
    const [pdfExportProgress, setPdfExportProgress] = React.useState(0);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const basePath = slug ? `/${slug}` : `/engagements/${engagement?.id}`;
    const mapExists = projectMapData?.latitude !== null && projectMapData?.longitude !== null;

    const handleProjectMapData = (data: Map) => {
        setProjectMapData(data);
    };

    const handleReadComments = () => {
        if (isLoggedIn) {
            navigate(`${basePath}/comments/${dashboardType}`);
        } else {
            navigate(`${languagePath}${basePath}/comments/${dashboardType}`);
        }
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
                    <Grid container item xs={12} flexDirection="column">
                        <Grid item xs={12} container justifyContent="flex-end">
                            <MuiLink
                                component={Link}
                                to={isLoggedIn ? `${basePath}/view` : `${languagePath}${basePath}/view`}
                                data-testid="link-container"
                            >
                                {translate('dashboard.link.0') + engagement.name + translate('dashboard.link.1')}
                            </MuiLink>
                        </Grid>
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
                                        <MetHeader1 textAlign={{ xs: 'center', sm: 'left' }}>
                                            {translate('dashboard.header')}
                                        </MetHeader1>
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
                                                {translate('dashboard.buttonText.readComments')}
                                            </PrimaryButton>
                                            <SecondaryButton
                                                onClick={() => {
                                                    setIsPrinting(true);
                                                }}
                                                loading={isPrinting}
                                            >
                                                {translate('dashboard.buttonText.exportToPDF')}
                                            </SecondaryButton>
                                        </Stack>
                                    </Grid>
                                </When>
                                <Grid
                                    container
                                    spacing={{ md: 0, lg: 3 }}
                                    rowSpacing={{ md: 1, lg: 3 }}
                                    item
                                    xs={12}
                                    ml={{ md: 0, lg: 2 }}
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
                                                            {translate('dashboard.submissionTrend.filter.from')}
                                                            {engagement.start_date}{' '}
                                                        </MetDescription>
                                                    </Grid>
                                                    <Grid item>
                                                        <MetDescription>
                                                            {translate('dashboard.submissionTrend.filter.to')}
                                                            {engagement.end_date}
                                                        </MetDescription>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </When>
                                        <Grid id={'kpi-emails-sent'} item sm={!mapExists ? 6 : 4}>
                                            <SurveyEmailsSent
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <Grid id={'kpi-surveys-completed'} item sm={!mapExists ? 6 : 4}>
                                            <SurveysCompleted
                                                engagement={engagement}
                                                engagementIsLoading={isEngagementLoading}
                                            />
                                        </Grid>
                                        <ProjectLocation
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                            handleProjectMapData={handleProjectMapData}
                                        />
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
                                                dashboardType={dashboardType}
                                            />
                                        </Box>
                                        <SurveyBar
                                            readComments={handleReadComments}
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                            dashboardType={dashboardType}
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
