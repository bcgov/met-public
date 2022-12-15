import React, { ReactNode, useRef, useState } from 'react';
import { Box, ClickAwayListener, IconButton, Paper } from '@mui/material';
import { Arrow, PopperArrow } from 'components/common/MetPopper';
import CloseIcon from '@mui/icons-material/Close';
import { ForumIcon } from './ForumIcon';

export const IconBox = ({ children }: { children: ReactNode }) => {
    const iconRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);

    return (
        <>
            <IconButton
                ref={iconRef}
                sx={{ marginTop: '-0.8em', marginLeft: '1em', color: '#458686' }}
                onClick={() => setOpen(!open)}
            >
                <ForumIcon fontSize="large" />
            </IconButton>
            <PopperArrow
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
            >
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper
                        elevation={0}
                        sx={{ bgcolor: '#F5FCFC', borderColor: '#9BE2DF', border: '3px solid #9BE2DF' }}
                    >
                        <Box sx={{ position: 'relative', margin: 0 }}>
                            <Arrow ref={setArrowRef} />
                            <IconButton
                                onClick={() => setOpen(!open)}
                                sx={{ position: 'relative', top: '0%', left: '92%', color: '#458686' }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            <Box maxWidth={'30em'} padding="1em">
                                {children}
                            </Box>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </PopperArrow>
        </>
    );
};
