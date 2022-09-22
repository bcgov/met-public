import React, { useContext } from 'react';
import { Box, Grid, IconButton, Skeleton, Stack } from '@mui/material';
import { Banner } from 'components/engagement/banner/Banner';
import { ActionContext } from './ActionContext';
import ReplayIcon from '@mui/icons-material/Replay';
import { MetHeader4 } from 'components/common';

export const SurveyBanner = () => {
    const { isEngagementLoading, savedEngagement, loadEngagement } = useContext(ActionContext);

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="38em" />;
    }

    if (!savedEngagement) {
        return (
            <Box
                sx={{
                    height: '10em',
                    backgroundColor: 'rgba(242, 242, 242)',
                }}
            >
                <Grid container direction="row" justifyContent="center" alignItems="center" height="100%">
                    <Stack direction="column" alignItems="center">
                        <MetHeader4>Could not load banner, press to try again</MetHeader4>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                if (loadEngagement) loadEngagement();
                            }}
                        >
                            <ReplayIcon />
                        </IconButton>
                    </Stack>
                </Grid>
            </Box>
        );
    }

    return <Banner savedEngagement={savedEngagement} />;
};
