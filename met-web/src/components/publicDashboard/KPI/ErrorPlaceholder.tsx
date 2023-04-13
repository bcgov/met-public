import { MetBody, MetHeader4, MetPaper } from 'components/common';
import React from 'react';
import { DASHBOARD } from './constants';
import { Grid, IconButton } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';

export const ErrorPlaceholder = ({ onClick }: { onClick: () => void }) => {
    return (
        <MetPaper
            sx={{
                width: '100%',
                height: '100%',
                minHeight: '213px',
                backgroundColor: DASHBOARD.KPI.BACKGROUND_COLOR,
                p: 2,
            }}
        >
            <Grid container justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
                <Grid item xs={12}>
                    <MetHeader4 color="error">Error</MetHeader4>
                </Grid>
                <Grid item xs={12}>
                    <MetBody color="error">Click to reload</MetBody>
                </Grid>
                <IconButton onClick={onClick}>
                    <LoopIcon sx={{ color: DASHBOARD.KPI.RADIALBAR.FILL_COLOR, fontSize: '4em' }} />
                </IconButton>
            </Grid>
        </MetPaper>
    );
};
