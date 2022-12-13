import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Box, Grid, Link, Popover } from '@mui/material';
import { MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';
import { When } from 'react-if';
import { IconBox } from './IconBox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { If, Then, Else } from 'react-if';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    readMoreBox?: ReactNode;
    iconBox?: ReactNode;
    children?: ReactNode;
    mobile?: boolean;
}
export const PhaseBoxMobile = ({ title, backgroundColor = 'white', readMoreBox, iconBox, mobile }: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
    const { anchorEl, setAnchorEl } = useContext(PhaseContext);

    const PhaseBoxRef = useRef<HTMLButtonElement | null>(null);

    const handleReadMoreClick = () => {
        setAnchorEl(PhaseBoxRef.current);
        setReadMoreOpen(true);
    };
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
                    maxWidth: { xl: '16%', xs: 'auto' },
                }}
            >
                <Grid container direction={'column'} spacing={0}>
                    <Grid item xs={12}>
                        <Box
                            ref={PhaseBoxRef}
                            sx={{
                                padding: '1em',
                                height: mobile ? '100%' : '10em',
                                width: '100%',
                            }}
                        >
                            <Grid container direction="column" justifyContent="space-between" height="100%" spacing={2}>
                                <Grid item>
                                    <MetHeader4 bold sx={{ color: 'white' }}>
                                        {title}
                                    </MetHeader4>
                                </Grid>
                                <Grid item sx={{ alignItems: 'flex-end', justifyContent: 'center' }} xs={12}>
                                    <When condition={Boolean(iconBox)}>
                                        <IconBox>{iconBox}</IconBox>
                                    </When>
                                </Grid>
                                <Grid item container direction="row" xs={12} justifyContent="flex-start">
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Read More</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>{readMoreBox}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </MetPaper>
            <When condition={Boolean(readMoreBox)}>
                <Popover
                    id={readMoreOpen ? `${title}-readmore-popover` : undefined}
                    open={readMoreOpen}
                    anchorEl={anchorEl}
                    onClose={() => setReadMoreOpen(false)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    elevation={0}
                    PaperProps={{
                        sx: {
                            borderRadius: 0,
                        },
                    }}
                >
                    {readMoreBox}
                </Popover>
            </When>
        </>
    );
};
