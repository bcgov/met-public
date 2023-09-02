import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { MetBody, MetLabel } from 'components/common';
import { Accordion, AccordionDetails, AccordionSummary, useMediaQuery, Theme } from '@mui/material';
import { Engagement } from 'models/engagement';
import { When } from 'react-if';
import SurveyEmailsSent from '../publicDashboard/KPI/SurveyEmailsSent';
import SurveysCompleted from '../publicDashboard/KPI/SurveysCompleted';
import ProjectLocation from '../publicDashboard/KPI/ProjectLocation';
import SubmissionTrend from '../publicDashboard/SubmissionTrend/SubmissionTrend';
import SurveyBar from '../publicDashboard/SurveyBar';
import { DashboardType } from 'constants/dashboardType';
import { Map } from 'models/analytics/map';

const EngagementsAccordion = ({
    engagements,
    bgColor,
    borderColor,
    disabled,
}: {
    engagements: Engagement[];
    bgColor: string;
    borderColor: string;
    disabled?: boolean;
}) => {
    const [openedEngagements, setOpenedEngagements] = useState<number[]>([]);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const [projectMapData, setProjectMapData] = React.useState<Map | null>(null);
    const mapExists = projectMapData?.latitude && projectMapData?.longitude;

    if (engagements.length == 0) {
        return (
            <Grid item xs={12}>
                <MetLabel>No Engagements Found</MetLabel>
            </Grid>
        );
    }

    const handleChange = (engagementId: number) => {
        if (!openedEngagements.some((id) => id == engagementId)) {
            setOpenedEngagements([...openedEngagements, engagementId]);
        }
    };

    const handleProjectMapData = (data: Map) => {
        setProjectMapData(data);
    };

    return (
        <>
            {engagements.map((engagement) => {
                return (
                    <Accordion
                        disabled={disabled}
                        onChange={() => {
                            handleChange(engagement.id);
                        }}
                        key={engagement.id}
                        sx={{
                            mt: 1,
                            borderStyle: 'solid',
                            borderColor: borderColor,
                            boxShadow: 'none',
                            '&.Mui-disabled': {
                                background: 'initial',
                            },
                        }}
                    >
                        <AccordionSummary
                            data-testid={`engagement-accordion-${engagement.id}`}
                            sx={{
                                '&.Mui-disabled': {
                                    opacity: 1,
                                },
                                backgroundColor: bgColor,
                                borderBottom: `solid 1px ${borderColor}`,
                            }}
                        >
                            <Grid container direction={isMobile ? 'column' : 'row'}>
                                <Grid item md={7} sm={12}>
                                    <MetLabel>{engagement.name}</MetLabel>
                                </Grid>
                                <Grid item md={5} sm={12} textAlign={isMobile ? 'left' : 'right'}>
                                    <MetBody>
                                        {engagement.start_date}
                                        {' - '}
                                        {engagement.end_date}
                                    </MetBody>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <When condition={openedEngagements.some((id) => id == engagement.id)}>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    spacing={3}
                                    data-testid={`dashboard-frame-${engagement.id}`}
                                >
                                    <Grid item xs={12} sm={!mapExists ? 6 : 4}>
                                        <SurveyEmailsSent engagement={engagement} engagementIsLoading={false} />
                                    </Grid>
                                    <Grid item xs={12} sm={!mapExists ? 6 : 4}>
                                        <SurveysCompleted engagement={engagement} engagementIsLoading={false} />
                                    </Grid>
                                    <When condition={mapExists}>
                                        <Grid item xs={12} sm={4}>
                                            <ProjectLocation
                                                engagement={engagement}
                                                engagementIsLoading={false}
                                                handleProjectMapData={handleProjectMapData}
                                            />
                                        </Grid>
                                    </When>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <SubmissionTrend engagement={engagement} engagementIsLoading={false} />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <SurveyBar
                                        engagement={engagement}
                                        engagementIsLoading={false}
                                        dashboardType={DashboardType.PUBLIC}
                                    />
                                </Grid>
                            </When>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
};

export default EngagementsAccordion;
