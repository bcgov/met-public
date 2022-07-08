import React, { useContext } from 'react';
import { Grid, Link as MuiLink } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { ActionContext } from './ActionContext';
import { Link } from 'react-router-dom';
import { MetPaper } from 'components/common';

const SurveySubmitWrapped = () => {
    const { savedSurvey } = useContext(ActionContext);
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
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
                sx={{ margin: '0 8em 1em 3em' }}
                spacing={2}
            >
                <Grid item container direction="row" justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagement/view/${savedSurvey.engagement.id}`}>
                        {`<< Return to ${savedSurvey.engagement.name} Engagement`}
                    </MuiLink>
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={2}>
                        <SurveyForm />
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmitWrapped;
