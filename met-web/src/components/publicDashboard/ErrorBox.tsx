import React from 'react';
import { Grid, IconButton, SxProps, Theme } from '@mui/material';
import { MetBody, MetHeader4, MetPaper } from 'components/common';
import LoopIcon from '@mui/icons-material/Loop';
import { DASHBOARD } from './constants';
import { When } from 'react-if';

interface ErrorBoxProps {
    height?: number | string;
    onClick: () => void;
    sx?: SxProps<Theme>;
    noData?: boolean;
}
export const ErrorBox = ({
    sx,
    onClick = () => {
        /*empty*/
    },
    noData,
}: ErrorBoxProps) => {
    return (
        <MetPaper
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: noData ? DASHBOARD.SURVEY_RESULT.BACKGROUND_COLOR : DASHBOARD.KPI.BACKGROUND_COLOR,
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
                <When condition={!noData}>
                    <Grid item>
                        <MetHeader4 color="error">Error</MetHeader4>
                        <MetBody color="error">Click to reload</MetBody>
                        <IconButton onClick={() => onClick()}>
                            <LoopIcon sx={{ color: DASHBOARD.KPI.RADIALBAR.FILL_COLOR, fontSize: '4em' }} />
                        </IconButton>
                    </Grid>
                </When>
                <When condition={noData}>
                    <Grid item>
                        <MetBody>No Data Available</MetBody>
                    </Grid>
                </When>
            </Grid>
        </MetPaper>
    );
};
