import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Box, Grid, Link, Popover, Stack, SxProps, Theme, useTheme } from '@mui/material';
import { MetHeader4, MetIconText, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';
import { Else, If, Then, When } from 'react-if';
import { IconBox } from './IconBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { CURRENT_PHASE, EngagementPhases } from 'models/engagementPhases';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    learnMoreBox?: ReactNode;
    iconBox?: ReactNode;
    children?: ReactNode;
    border?: string;
    sx?: SxProps<Theme>;
    isCurrentPhase: boolean;
    currentPhase: number;
}
export const PhaseBox = ({
    title,
    backgroundColor = 'var(--bcds-surface-background-white)',
    learnMoreBox,
    iconBox,
    currentPhase,
    border = 'none',
    sx = {},
    isCurrentPhase = false,
}: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
    const { anchorEl, setAnchorEl } = useContext(PhaseContext);
    const theme = useTheme();

    const PhaseBoxRef = useRef<HTMLButtonElement | null>(null);

    const handleReadMoreClick = () => {
        setAnchorEl(PhaseBoxRef.current);
        setReadMoreOpen(true);
    };
    return (
        <Stack
            direction="column"
            sx={{
                maxWidth: { xl: '20%', md: 'auto' },
            }}
        >
            <When condition={currentPhase !== EngagementPhases.Standalone}>
                <If condition={isCurrentPhase}>
                    <Then>
                        <Stack justifyContent={'flex-end'} height="3em">
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                    [theme.breakpoints.up('lg')]: {
                                        marginLeft: '1em',
                                    },
                                }}
                            >
                                <LocationOnIcon fontSize="medium" htmlColor={CURRENT_PHASE.iconColor} />
                                <MetIconText sx={{ fontStyle: 'italic', overflow: 'visible' }}>
                                    Current Phase
                                </MetIconText>
                            </Stack>
                        </Stack>
                    </Then>
                    <Else>
                        <span style={{ marginBottom: '3em' }} />
                    </Else>
                </If>
            </When>
            <MetPaper
                sx={[
                    {
                        borderRadius: 0,
                        border: border,
                        backgroundColor: backgroundColor,
                        height: '9rem',
                    },
                    { ...sx },
                ]}
            >
                <Grid container direction="row" spacing={0}>
                    <Grid item xs={12}>
                        <Box
                            ref={PhaseBoxRef}
                            sx={{
                                padding: '1em',
                                height: '9rem',
                            }}
                        >
                            <Grid container direction="column" justifyContent="space-between" height="100%">
                                <Grid item>
                                    <MetHeader4 bold sx={{ color: 'white' }}>
                                        {title}
                                    </MetHeader4>
                                </Grid>
                                <Grid item container direction="row" justifyContent="flex-end">
                                    <Grid item>
                                        <Link
                                            component={MetSmallText}
                                            sx={{ cursor: 'pointer', color: 'white', ':hover': { fontWeight: 'bold' } }}
                                            onClick={handleReadMoreClick}
                                            color="inherit"
                                            underline="always"
                                        >
                                            Learn More
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </MetPaper>
            <When condition={Boolean(iconBox)}>
                <Box>
                    <IconBox>{iconBox}</IconBox>
                </Box>
            </When>

            <When condition={Boolean(learnMoreBox)}>
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
                    {learnMoreBox}
                </Popover>
            </When>
        </Stack>
    );
};
