import React from 'react';
import { Grid2 as Grid, Paper, SxProps, Theme } from '@mui/material';

import { DASHBOARD } from './constants';
import { useAppTranslation } from 'hooks';
import { BodyText } from 'components/common/Typography/Body';

interface NoDataProps {
    height?: number | string;
    sx?: SxProps<Theme>;
}
export const NoData = ({ sx }: NoDataProps) => {
    const { t: translate } = useAppTranslation();

    return (
        <Paper
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
                <Grid>
                    <BodyText>{translate('dashboard.noData')}</BodyText>
                </Grid>
            </Grid>
        </Paper>
    );
};
