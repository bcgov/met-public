import React, { ReactNode, useRef, useState } from 'react';
import { Box, ClickAwayListener, IconButton, Paper, Popper, useTheme } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';

export const IconBox = ({ children }: { children: ReactNode }) => {
    const iconRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);

    const theme = useTheme();

    return (
        <>
            <IconButton
                ref={iconRef}
                sx={{ marginTop: '-0.8em', marginLeft: '1em', color: '#458686' }}
                onClick={() => setOpen(!open)}
            >
                <ForumIcon fontSize="large" />
            </IconButton>
            <Popper
                anchorEl={iconRef.current}
                open={open}
                placement="bottom-start"
                modifiers={[
                    {
                        name: 'arrow',
                        enabled: true,
                        options: {
                            element: arrowRef,
                        },
                    },
                ]}
                sx={{
                    zIndex: theme.zIndex.tooltip,
                }}
            >
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper
                        elevation={0}
                        sx={{ bgcolor: '#F5FCFC', borderColor: '#9BE2DF', border: '3px solid #9BE2DF' }}
                    >
                        <Box sx={{ position: 'relative', margin: 0 }}>
                            <Box
                                component="span"
                                ref={setArrowRef}
                                sx={[
                                    {
                                        overflow: 'hidden',
                                        position: 'absolute',
                                        width: '1em',
                                        height: '0.71em' /* = width / sqrt(2) = (length of the hypotenuse) */,
                                        boxSizing: 'border-box',
                                        color: '#9BE2DF',
                                    },
                                    {
                                        '&::before': {
                                            content: '""',
                                            margin: 'auto',
                                            display: 'block',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'currentColor',
                                            transform: 'rotate(45deg)',
                                        },
                                    },
                                    {
                                        top: 0,
                                        left: 0,
                                        marginTop: '-0.71em',
                                        '&::before': {
                                            transformOrigin: '0 100%',
                                        },
                                    },
                                ]}
                            />
                            <Box maxWidth={'30em'} padding="1em">
                                {children}
                            </Box>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
};
