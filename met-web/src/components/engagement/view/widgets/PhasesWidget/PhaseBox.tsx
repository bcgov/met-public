import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Box, Grid, Link, Popover, Stack, SxProps, Theme } from '@mui/material';
import { MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';
import { Else, If, Then, When } from 'react-if';
import { IconBox } from './IconBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { EngagementPhases } from 'models/engagementPhases';

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
    backgroundColor = 'white',
    learnMoreBox,
    iconBox,
    currentPhase,
    border = 'none',
    sx = {},
    isCurrentPhase = false,
}: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
    const { anchorEl, setAnchorEl } = useContext(PhaseContext);

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
                minWidth: { xl: '10%', md: 'auto' },
            }}
        >
            <When condition={currentPhase !== EngagementPhases.Standalone}>
                <If condition={isCurrentPhase}>
                    <Then>
                        <Stack direction="row" height="3em" alignItems={'center'}>
                            <Box marginLeft={'1em'} color="#D8292F">
                                <LocationOnIcon fontSize="large" />
                            </Box>
                            <MetSmallText sx={{ fontStyle: 'italic', overflow: 'visible' }}>Current Phase</MetSmallText>
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
                        height: '10em',
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
                                height: '10em',
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
                                            Learn more
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
