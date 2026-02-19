import React from 'react';
import { Grid } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { MetPaper } from 'components/common';
import { InvalidTokenModal } from './InvalidTokenModal';
import { EngagementLink } from './EngagementLink';
import { PreviewBanner } from './PreviewBanner';

const SurveySubmit = () => {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <PreviewBanner />
            </Grid>
            <Grid item xs={12}>
                <SurveyBanner />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ lg: '2em 8em 1em 3em', md: '2em', xs: '1em' }}
            >
                <Grid item container direction="row" justifyContent="flex-end">
                    <EngagementLink />
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={2}>
                        <SurveyForm />
                        <InvalidTokenModal />
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmit;
