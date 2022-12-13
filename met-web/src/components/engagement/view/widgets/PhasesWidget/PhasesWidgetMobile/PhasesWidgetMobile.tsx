import React, { ReactNode, useContext, useState } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import { MetBody, MetHeader3, MetPaper, MetParagraph } from 'components/common';
import { WidgetType } from 'models/widget';
import { styled } from '@mui/material/styles';
import { ActionContext } from '../../../ActionContext';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { EngagementPhaseMobile } from './EngagementPhaseMobile';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ENGAGEMENT_PHASES } from 'models/engagementPhases';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    }),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface PhaseContextProps {
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

export const PhaseContext = React.createContext<PhaseContextProps>({
    anchorEl: null,
    setAnchorEl: () => {
        throw new Error('Not implemented');
    },
});
export const PhasesWidgetMobile = () => {
    const { widgets, isWidgetsLoading } = useContext(ActionContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);

    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    if (isWidgetsLoading) {
        return <Skeleton variant="rectangular" height={'20em'} />;
    }

    if (!phasesWidget) {
        return null;
    }

    return (
        <PhaseContext.Provider
            value={{
                anchorEl,
                setAnchorEl,
            }}
        >
            <MetPaper elevation={1} sx={{ padding: '2em' }}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                    <Grid item xs={12}>
                        <MetHeader3 bold>The EA Process</MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>
                            Click on the sections below to expand them and learn more about each EA process phase. You
                            can also learn more about each engagement period by clicking the engagement icon.
                        </MetBody>
                    </Grid>
                    <Grid item xs={12} sx={{ maxWidth: '99%' }}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>The EA Process</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.EarlyEngagement.title}
                                    backgroundColor={ENGAGEMENT_PHASES.EarlyEngagement.backgroundColor}
                                    learnMoreBackgroundColor={
                                        ENGAGEMENT_PHASES.EarlyEngagement.learnMoreBackgroundColor
                                    }
                                    learnMoreText={ENGAGEMENT_PHASES.EarlyEngagement.learnMoreText}
                                    popOverText={ENGAGEMENT_PHASES.EarlyEngagement.popOverText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.ReadinessDecision.title}
                                    backgroundColor={ENGAGEMENT_PHASES.ReadinessDecision.backgroundColor}
                                    learnMoreBackgroundColor={
                                        ENGAGEMENT_PHASES.ReadinessDecision.learnMoreBackgroundColor
                                    }
                                    learnMoreText={ENGAGEMENT_PHASES.ReadinessDecision.learnMoreText}
                                    popOverText={ENGAGEMENT_PHASES.ReadinessDecision.popOverText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.ProcessPlanning.title}
                                    backgroundColor={ENGAGEMENT_PHASES.ProcessPlanning.backgroundColor}
                                    learnMoreBackgroundColor={
                                        ENGAGEMENT_PHASES.ProcessPlanning.learnMoreBackgroundColor
                                    }
                                    learnMoreText={ENGAGEMENT_PHASES.ProcessPlanning.learnMoreText}
                                    popOverText={ENGAGEMENT_PHASES.ProcessPlanning.popOverText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.AppDevReview.title}
                                    backgroundColor={ENGAGEMENT_PHASES.AppDevReview.backgroundColor}
                                    learnMoreBackgroundColor={ENGAGEMENT_PHASES.AppDevReview.learnMoreBackgroundColor}
                                    learnMoreText={ENGAGEMENT_PHASES.AppDevReview.learnMoreText}
                                    popOverText={ENGAGEMENT_PHASES.AppDevReview.popOverText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.EffectAssessmentReview.title}
                                    backgroundColor={ENGAGEMENT_PHASES.EffectAssessmentReview.backgroundColor}
                                    learnMoreBackgroundColor={
                                        ENGAGEMENT_PHASES.EffectAssessmentReview.learnMoreBackgroundColor
                                    }
                                    learnMoreText={ENGAGEMENT_PHASES.EffectAssessmentReview.learnMoreText}
                                    popOverText={ENGAGEMENT_PHASES.EffectAssessmentReview.popOverText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.Decision.title}
                                    backgroundColor={ENGAGEMENT_PHASES.Decision.backgroundColor}
                                    learnMoreBackgroundColor={ENGAGEMENT_PHASES.Decision.learnMoreBackgroundColor}
                                    learnMoreText={ENGAGEMENT_PHASES.Decision.learnMoreText}
                                    mobile={true}
                                />
                                <EngagementPhaseMobile
                                    title={ENGAGEMENT_PHASES.PostCertificate.title}
                                    backgroundColor={ENGAGEMENT_PHASES.PostCertificate.backgroundColor}
                                    learnMoreBackgroundColor={
                                        ENGAGEMENT_PHASES.PostCertificate.learnMoreBackgroundColor
                                    }
                                    learnMoreText={ENGAGEMENT_PHASES.PostCertificate.learnMoreText}
                                    mobile={true}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </MetPaper>
        </PhaseContext.Provider>
    );
};
