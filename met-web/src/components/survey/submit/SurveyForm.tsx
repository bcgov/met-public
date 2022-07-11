import React, { useContext, useState } from 'react';
import { Skeleton, Grid, Stack, Button } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { useNavigate } from 'react-router-dom';
import { FormSubmissionData } from 'components/Form/types';
import { submitSurvey } from 'services/surveyService/submission';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export const SurveyForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, savedSurvey } = useContext(ActionContext);
    const [submissionData, setSubmissionData] = useState<unknown>(null);

    const handleChange = (filledForm: FormSubmissionData) => {
        setSubmissionData(filledForm.data);
    };

    const handleSubmit = async () => {
        try {
            await submitSurvey({
                survey_id: savedSurvey.id,
                submission_json: submissionData,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey was successfully submitted',
                }),
            );
            navigate(`/engagement/view/${savedSurvey.engagement.id}`);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred during survey submission',
                }),
            );
        }
    };

    if (isLoading) {
        return <Skeleton variant="rectangular" height="50em" width="100%" />;
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            padding={'2em 2em 1em 2em'}
        >
            <Grid item xs={12}>
                <FormSubmit savedForm={savedSurvey.form_json} handleFormChange={handleChange} />
            </Grid>
            <Grid item xs={12} container direction="row" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={() => handleSubmit()}>
                        Submit Survey
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
