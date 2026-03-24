import React, { useContext } from 'react';
import Grid from '@mui/material/Grid2';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header3 } from 'components/common/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, styled } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import EngagementAccordion from './EngagementsAccordion';
import { SubmissionStatus } from 'constants/engagementStatus';
import { DashboardContext } from './DashboardContext';
import { Palette } from 'styles/Theme';

const EngagementList = () => {
    const { openEngagements, upcomingEngagements, closedEngagements, isLoading } = useContext(DashboardContext);

    const lastMonthDate = new Date(new Date().setDate(new Date().getDate() - 30));
    const recentlyClosedEngagements = closedEngagements.filter(
        (engagement) =>
            engagement.submission_status == SubmissionStatus.Closed && new Date(engagement.end_date) >= lastMonthDate,
    );
    const oldClosedEngagements = closedEngagements.filter(
        (engagement) =>
            engagement.submission_status == SubmissionStatus.Closed && new Date(engagement.end_date) < lastMonthDate,
    );

    const StyledAccordion = styled(Accordion)({
        border: 'solid 1px #cdcdcd',
        boxShadow:
            'rgb(0 0 0 / 6%) 0px 2px 2px -1px, rgb(0 0 0 / 6%) 0px 1px 1px 0px, rgb(0 0 0 / 6%) 0px 1px 3px 0px;',
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <ResponsiveContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={3}
        >
            <Grid size={12}>
                <Header1>Engagements Dashboard</Header1>
            </Grid>
            <Grid size={12}>
                <StyledAccordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} style={{ margin: '0 6px' }} />}
                        sx={{ flexDirection: 'row-reverse' }}
                    >
                        <Header3 weight="bold">Upcoming Engagements</Header3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={upcomingEngagements}
                            bgColor={Palette.dashboard.upcoming.bg}
                            borderColor={Palette.dashboard.upcoming.border}
                            disabled={true}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid size={12}>
                <StyledAccordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} style={{ margin: '0 6px' }} />}
                        sx={{ flexDirection: 'row-reverse' }}
                    >
                        <Header3 weight="bold">Open Engagements</Header3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={openEngagements}
                            bgColor={Palette.dashboard.open.bg}
                            borderColor={Palette.dashboard.open.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid size={12}>
                <StyledAccordion>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} style={{ margin: '0 6px' }} />}
                        sx={{ flexDirection: 'row-reverse' }}
                    >
                        <Header3 weight="bold">Recently Closed Engagements (last 30 days)</Header3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={recentlyClosedEngagements}
                            bgColor={Palette.dashboard.closed.bg}
                            borderColor={Palette.dashboard.closed.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid size={12}>
                <StyledAccordion>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} style={{ margin: '0 6px' }} />}
                        sx={{ flexDirection: 'row-reverse' }}
                    >
                        <Header3 weight="bold">Closed Engagements (over 30 days ago)</Header3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={oldClosedEngagements}
                            bgColor={Palette.dashboard.closed.bg}
                            borderColor={Palette.dashboard.closed.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
        </ResponsiveContainer>
    );
};

export default EngagementList;
