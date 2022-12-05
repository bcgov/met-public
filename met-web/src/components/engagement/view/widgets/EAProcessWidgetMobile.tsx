import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Link from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import EAProcess from './EAProcess';

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

export default function CustomizedAccordions() {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>The EA Process</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EAProcess backgroundColor="#54858D" headerText="Early Engagement" overlayText="" />
                    <EAProcess backgroundColor="#DA6D65" headerText="Readiness Decision" overlayText="" />
                    <EAProcess backgroundColor="#043673" headerText="Process Planning" overlayText="" />
                    <EAProcess backgroundColor="#4D95D0" headerText="Application Development & Review" overlayText="" />
                    <EAProcess
                        backgroundColor="#E7A913"
                        headerText="Effect Assesment & Recommendation"
                        overlayText=""
                    />
                    <EAProcess backgroundColor="#6A54A3" headerText="Decision" overlayText="" />
                    <EAProcess backgroundColor="#A6BB2E" headerText="Post-Certificate" overlayText="" />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
