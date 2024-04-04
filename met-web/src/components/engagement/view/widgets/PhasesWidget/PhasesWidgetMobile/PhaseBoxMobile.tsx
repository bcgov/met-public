import React, { ReactNode, useRef } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { MetHeader4, MetPaper } from 'components/common';
import { IconBox } from '../IconBox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { If, Then, When } from 'react-if';
import LocationOn from '@mui/icons-material/LocationOn';
import { EngagementPhases } from 'models/engagementPhases';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    learnMoreBox?: ReactNode;
    iconBox?: ReactNode;
    children?: ReactNode;
    readMoreBackground?: string;
    accordionBackground?: string;
    isCurrentPhase: boolean;
    currentPhase: number;
}
export const PhaseBoxMobile = ({
    title,
    backgroundColor = 'var(--bcds-surface-background-white)',
    learnMoreBox,
    iconBox,
    accordionBackground,
    isCurrentPhase = false,
    currentPhase,
}: PhaseBoxProps) => {
    const PhaseBoxRef = useRef<HTMLButtonElement | null>(null);

    return (
        <>
            <MetPaper
                sx={{
                    borderRadius: 0,
                    border: 'none',
                    backgroundColor: backgroundColor,
                    height: '100%',
                    minHeight: '10em',
                    minWidth: { xl: '10%', xs: 'auto' },
                }}
            >
                <Grid container direction={'column'} spacing={0}>
                    <Grid item xs={12}>
                        <Box
                            ref={PhaseBoxRef}
                            sx={{
                                padding: '1em',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <Grid container direction="column" justifyContent="space-between" height="100%" spacing={2}>
                                <Grid item>
                                    <Stack direction="row">
                                        <MetHeader4 bold sx={{ color: 'white' }}>
                                            {title}
                                        </MetHeader4>
                                        <When condition={currentPhase !== EngagementPhases.Standalone}>
                                            <If condition={isCurrentPhase}>
                                                <Then>
                                                    <Box marginLeft={'1em'} color="#D8292F">
                                                        <LocationOn fontSize="large" />
                                                    </Box>
                                                </Then>
                                            </If>
                                        </When>
                                    </Stack>
                                </Grid>
                                <Grid item container xs={12}>
                                    <Grid item xs={8}></Grid>
                                    <When condition={Boolean(iconBox)}>
                                        <Grid item xs={4} sx={{ mt: 1 }}>
                                            <IconBox>{iconBox}</IconBox>
                                        </Grid>
                                    </When>
                                </Grid>
                                <Grid item container direction="row" xs={12} justifyContent="flex-start">
                                    <Accordion sx={{ background: accordionBackground }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon color="info" />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Learn More</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>{learnMoreBox}</AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </MetPaper>
        </>
    );
};
