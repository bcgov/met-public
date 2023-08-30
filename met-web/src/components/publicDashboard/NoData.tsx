import React from 'react';
import { Grid, SxProps, Theme } from '@mui/material';
import { MetBody, MetPaper } from 'components/common';
import { DASHBOARD } from './constants';

interface NoDataProps {
    height?: number | string;
    sx?: SxProps<Theme>;
}
export const NoData = ({ sx }: NoDataProps) => {
    return (
        <MetPaper
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: DASHBOARD.SURVEY_RESULT.BACKGROUND_COLOR,
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
                    <MetBody>No Data Available</MetBody>
                </Grid>
            </Grid>
        </MetPaper>
    );
};
