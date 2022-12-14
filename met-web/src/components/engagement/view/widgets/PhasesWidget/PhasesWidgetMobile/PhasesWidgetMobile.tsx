import React, { useContext } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import { MetBody, MetHeader3, MetPaper } from 'components/common';
import { WidgetType } from 'models/widget';
import { styled } from '@mui/material/styles';
import { ActionContext } from '../../../ActionContext';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { EngagementPhaseMobile } from './EngagementPhaseMobile';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ENGAGEMENT_PHASES, ProcessStageProps } from 'models/engagementPhases';

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

export const PhasesWidgetMobile = () => {
    const phases = Object.values(ENGAGEMENT_PHASES);
    const { widgets, isWidgetsLoading } = useContext(ActionContext);

    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);

    const [expanded, setExpanded] = React.useState<boolean>(false);

    const handleChange = (state: boolean) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    if (isWidgetsLoading) {
        return <Skeleton variant="rectangular" height={'20em'} />;
    }

    if (!phasesWidget) {
        return null;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em' }}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                <Grid item xs={12}>
                    <MetHeader3 bold>The EA Process</MetHeader3>
                </Grid>
                <Grid item xs={12}>
                    <MetBody>
                        Click on the sections below to expand them and learn more about each EA process phase. You can
                        also learn more about each engagement period by clicking the engagement icon.
                    </MetBody>
                </Grid>
                <Grid item xs={12} sx={{ maxWidth: '99%' }}>
                    <Accordion expanded={expanded} onChange={handleChange(!expanded)} data-testid="eaProcessAccordion">
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>The EA Process</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {phases.map((phase: ProcessStageProps) => (
                                <EngagementPhaseMobile key={phase.title} data-testid={`${phase.title}`} {...phase} />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </MetPaper>
    );
};
