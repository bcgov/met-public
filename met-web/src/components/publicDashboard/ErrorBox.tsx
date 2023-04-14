import React from 'react';
import { Grid, IconButton } from '@mui/material';
import { MetBody, MetHeader4, MetPaper } from 'components/common';
import LoopIcon from '@mui/icons-material/Loop';
import { DASHBOARD } from './constants';

interface ErrorBoxProps {
    height: number | string;
    onClick: () => void;
}
export const ErrorBox = ({
    height,
    onClick = () => {
        /*empty*/
    },
}: ErrorBoxProps) => {
    return (
        <MetPaper
            sx={{
                width: '100%',
                height: height,
                backgroundColor: DASHBOARD.KPI.BACKGROUND_COLOR,
                p: 2,
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
