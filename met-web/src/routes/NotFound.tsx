import { Grid, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { MetHeader3 } from 'components/common';
import React from 'react';
import { IProps } from './types';
import { useTheme } from '@mui/material/styles';

const NotFound = React.memo(
    ({
        errorMessage = `We couldn't find the page you were looking for. Perhaps you entered the wrong URL? Please verify that the spelling/ capitalization are correct and try reloading the page.`,
        errorCode = '404',
    }: IProps) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

        return (
            <>
                <Toolbar />
                <Grid
                    container
                    direction={isMobile ? 'column' : 'row'}
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    padding={'2em 2em 1em 2em'}
                >
                    <Grid item sx={{ mr: 2 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '5em' }}>
                            {errorCode}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} justifyContent="center">
                        <MetHeader3 align="flex-start">{errorMessage}</MetHeader3>
                    </Grid>
                </Grid>
            </>
        );
    },
);

export default NotFound;
