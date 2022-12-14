import React, { ReactNode, useRef, useState } from 'react';
import { Box, Grid, Popover } from '@mui/material';
import { MetHeader4, MetPaper } from 'components/common';
import { When } from 'react-if';
import { IconBox } from '../IconBox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    readMoreBox?: ReactNode;
    iconBox?: ReactNode;
    children?: ReactNode;
    readMoreBackground?: string;
    accordionBackground?: string;
}
export const PhaseBoxMobile = ({
    title,
    backgroundColor = 'white',
    readMoreBox,
    readMoreBackground,
    iconBox,
    accordionBackground,
}: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
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
                                    <MetHeader4 bold sx={{ color: 'white' }}>
                                        {title}
                                    </MetHeader4>
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
                                            expandIcon={<ExpandMoreIcon htmlColor="#000000" />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ color: 'black' }}>Learn More</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>{readMoreBox}</AccordionDetails>
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
