import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Box, Grid, Link, Popover, Typography } from '@mui/material';
import { MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';
import { When } from 'react-if';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    readMoreBox?: ReactNode;
    children?: ReactNode;
}
export const PhaseBox = ({ title, backgroundColor = 'white', readMoreBox }: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
    // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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
                    height: '10em',
                }}
                m={1}
            >
                <Box
                    ref={PhaseBoxRef}
                    sx={{
                        backgroundColor: backgroundColor,
                        padding: '1em',
                        height: '100%',
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
                                <MetSmallText
                                    component={Link}
                                    sx={{ color: 'white', cursor: 'pointer' }}
                                    onClick={handleReadMoreClick}
                                >
                                    Read more
                                </MetSmallText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
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
                >
                    {readMoreBox}
                </Popover>
            </When>
        </>
    );
};
