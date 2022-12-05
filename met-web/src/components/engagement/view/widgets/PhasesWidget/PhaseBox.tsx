import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Box, Grid, IconButton, Link, Popover, Typography } from '@mui/material';
import { MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { PhaseContext } from '.';
import { When } from 'react-if';
import ForumIcon from '@mui/icons-material/Forum';
import { IconBox } from './IconBox';

interface PhaseBoxProps {
    title: string;
    backgroundColor?: string;
    readMoreBox?: ReactNode;
    iconBox?: ReactNode;
    children?: ReactNode;
}
export const PhaseBox = ({ title, backgroundColor = 'white', readMoreBox, iconBox }: PhaseBoxProps) => {
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
                    backgroundColor: backgroundColor,
                    height: '10em',
                    marginBottom: '1.5em',
                }}
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
                    </Grid>
                    <Grid item xs={12}>
                        <When condition={Boolean(iconBox)}>
                            <IconBox>{iconBox}</IconBox>
                        </When>
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
