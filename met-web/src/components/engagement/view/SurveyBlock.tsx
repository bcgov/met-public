import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { MetPaper } from '../../common';
import './EngagementContent.scss';
import { useNavigate } from 'react-router-dom';
import { ActionContext } from './ActionContext';
import { SurveyBlockProps } from './types';

const SurveyBlock = (props: SurveyBlockProps) => {
    const { savedEngagement } = useContext(ActionContext);
    const navigate = useNavigate();

    const surveyId = savedEngagement.surveys[0]?.id || '';

    return (
        <MetPaper elevation={1} sx={{ padding: '2em' }}>
            <Grid container direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">Let us know what you think!</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">
                        We would like to hear from you about this project and how it could affect you and your
                        environment. Please fill in our short survey and leave a comment. Survey takes 3-5min to
                        complete
                    </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" direction="row">
                    <Button variant="contained" disabled={!surveyId} onClick={() => props.openModal}>
                        Take me to the survey
                    </Button>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default SurveyBlock;
