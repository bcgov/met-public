import React from 'react';
import { Grid2 as Grid, Paper } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { InvalidTokenModal } from './InvalidTokenModal';
import { EngagementLink } from './EngagementLink';
import { PreviewBanner } from './PreviewBanner';

const SurveySubmit = () => {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid size={12}>
                <PreviewBanner />
            </Grid>
            <Grid size={12}>
                <SurveyBanner />
            </Grid>
            <Grid
                container
                size={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ lg: '2em 8em 1em 3em', md: '2em', xs: '1em' }}
            >
                <Grid container size={12} direction="row" justifyContent="flex-end">
                    <EngagementLink />
                </Grid>
                <Grid size={12}>
                    <Paper elevation={2}>
                        <SurveyForm />
                        <InvalidTokenModal />
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmit;
