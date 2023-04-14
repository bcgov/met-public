import React from 'react';
import { Grid, IconButton, SxProps, Theme } from '@mui/material';
import { MetBody, MetHeader4, MetPaper } from 'components/common';
import LoopIcon from '@mui/icons-material/Loop';
import { DASHBOARD } from './constants';

interface ErrorBoxProps {
    height?: number | string;
    onClick: () => void;
    sx?: SxProps<Theme>;
}
export const ErrorBox = ({
    sx,
    onClick = () => {
        /*empty*/
    },
}: ErrorBoxProps) => {
    return (
        <MetPaper
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: DASHBOARD.KPI.BACKGROUND_COLOR,
                p: 2,
                ...sx,
            }}
        >
            <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                height="100%"
            >
                <Grid item>
                    <MetHeader4 color="error">Error</MetHeader4>
                    <MetBody color="error">Click to reload</MetBody>
                    <IconButton onClick={() => onClick()}>
                        <LoopIcon sx={{ color: DASHBOARD.KPI.RADIALBAR.FILL_COLOR, fontSize: '4em' }} />
                    </IconButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};
