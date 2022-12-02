import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Box, Grid, Link, Popover, Typography } from '@mui/material';
import { MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    children?: ReactNode;
}
export const PhaseBox = ({ title, backgroundColor = 'white' }: PhaseBoxProps) => {
    const [readMoreOpen, setReadMoreOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const {} = useContext(PhaseContext);

    const PhaseBoxRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (PhaseBoxRef.current) {
            setAnchorEl(PhaseBoxRef.current);
        }
    }, [PhaseBoxRef]);

    const handleReadMoreClick = () => {
        // setAnchorEl(e.currentTarget);
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
                elevation={title === 'Decision' ? 3 : 0}
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
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
        </>
    );
};
