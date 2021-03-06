import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { MetPaper } from '../../common';
import './EngagementContent.scss';
import { ActionContext } from './ActionContext';
import { SubmissionStatus } from 'constants/engagementStatus';
import { SurveyBlockProps } from './types';
import { useAppSelector } from 'hooks';

const SurveyBlock = ({ startSurvey }: SurveyBlockProps) => {
    const { savedEngagement } = useContext(ActionContext);

    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;

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
                    <Button
                        data-testid="SurveyBlock/take-me-to-survey-button"
                        variant="contained"
                        disabled={!surveyId || (!isOpen && !isPreview)}
                        onClick={startSurvey}
                    >
                        Take me to the survey
                    </Button>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default SurveyBlock;
