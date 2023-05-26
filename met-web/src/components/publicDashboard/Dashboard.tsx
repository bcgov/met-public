import React, { useContext } from 'react';
import { Grid, Link as MuiLink, useMediaQuery, Stack, Theme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MetHeader1, MetPaper, PrimaryButton, SecondaryButton, MetDescription } from 'components/common';
import { ReportBanner } from './ReportBanner';
import SurveysCompleted from './KPI/SurveysCompleted';
import ProjectLocation from './KPI/ProjectLocation';
import SurveyEmailsSent from './KPI/SurveyEmailsSent';
import SubmissionTrend from './SubmissionTrend/SubmissionTrend';
import { DashboardContext } from './DashboardContext';
import SurveyBar from './SurveyBar.tsx';
import SurveyBarPrintable from './SurveyBarPrintable';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { When } from 'react-if';

export const Dashboard = () => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { engagement, isEngagementLoading } = useContext(DashboardContext);

    const handleReadComments = () => {
        navigate(`/engagements/${engagement.id}/comments`);
    };

    const createPdf = async () => {
        const doc = new jsPDF('p', 'mm');

        const padding = 10;
        const marginTop = 20;
        let top = marginTop;

        const kpi = document.getElementById('kpi');
        if (kpi) {
            const kpiData = await htmlToImage.toPng(kpi);
            doc.addImage(kpiData, 'PNG', padding, top, 190, 55, 'kpi');
        }

        const submissiontrend = document.getElementById('submissiontrend');
        if (submissiontrend) {
            const submissiontrendData = await htmlToImage.toPng(submissiontrend);
            doc.addImage(submissiontrendData, 'PNG', padding, top + 75, 190, 60, 'submissiontrend');
        }

        doc.addPage();

        const question_ids = document.querySelectorAll('[id*="question"]');
        const length = question_ids.length;
        for (let i = 0; i < length; i++) {
            const elements = document.getElementById(question_ids[i].id);
            if (elements) {
                const imgData = await htmlToImage.toPng(elements);
                let elHeight = elements.offsetHeight + 20;
                let elWidth = elements.offsetWidth + 20;
                const pageWidth = doc.internal.pageSize.getWidth();

                if (elWidth > pageWidth) {
                    const ratio = pageWidth / elWidth;
                    elHeight = elHeight * ratio - padding * 2;
                    elWidth = elWidth * ratio - padding * 2;
                }

                const pageHeight = 290;

                if (top + elHeight > pageHeight) {
                    doc.addPage();
                    top = marginTop;
                }
                doc.addImage(imgData, 'PNG', padding, top, elWidth, elHeight, `image${i}`);
                top += elHeight + marginTop;
            }
        }
        window.open(doc.output('bloburl'));
    };

    const showPrintableCharts = async () => {
        const node = document.getElementById('surveybarprintable');
        if (node) {
            node.style.display = 'block';
        }
    };

    const hidePrintableCharts = async () => {
        const node = document.getElementById('surveybarprintable');
        if (node) {
            node.style.display = 'none';
        }
    };

    const handleCreatePdf = async () => {
        await showPrintableCharts();
        await createPdf();
        await hidePrintableCharts();
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
                                <Stack direction="row" spacing={1}>
                                    <PrimaryButton
                                        data-testid="SurveyBlock/take-me-to-survey-button"
                                        onClick={handleReadComments}
                                    >
                                        Read Comments
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => {
                                            handleCreatePdf();
                                        }}
                                    >
                                        Export to PDF
                                    </SecondaryButton>
                                </Stack>
                            </Grid>
                            <div id={'kpi'} style={{ width: '100%', paddingTop: '30px' }}>
                                <Grid
                                    container
                                    spacing={isSmallScreen ? 0 : 3}
                                    item
                                    xs={12}
                                    alignItems={'space-evenly'}
                                    justifyContent={'space-evenly'}
                                >
                                    <When condition={isSmallScreen}>
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
                                    <Grid item sm={4} md={4}>
                                        <SurveyEmailsSent
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                        />
                                    </Grid>
                                    <Grid item sm={4} md={4}>
                                        <SurveysCompleted
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                        />
                                    </Grid>
                                    <Grid item sm={12} md={4}>
                                        <ProjectLocation
                                            engagement={engagement}
                                            engagementIsLoading={isEngagementLoading}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div id={'submissiontrend'} style={{ width: '100%', paddingTop: '30px' }}>
                                <Grid ml={isSmallScreen ? 0 : 5} item xs={12}>
                                    <SubmissionTrend
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </Grid>
                            </div>
                            <Grid item xs={12}>
                                <div id={'surveybarprintable'} style={{ display: 'none ' }}>
                                    <SurveyBarPrintable
                                        engagement={engagement}
                                        engagementIsLoading={isEngagementLoading}
                                    />
                                </div>
                                <SurveyBar engagement={engagement} engagementIsLoading={isEngagementLoading} />
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
