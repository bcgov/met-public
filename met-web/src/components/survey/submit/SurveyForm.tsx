import React, { useContext, useState } from 'react';
import { Skeleton, Grid, Stack, Button, CircularProgress } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { useNavigate } from 'react-router-dom';
import { FormSubmissionData } from 'components/Form/types';
import { submitSurvey } from 'services/surveyService/submission';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export const SurveyForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { isLoading, savedSurvey, token } = useContext(ActionContext);
    const [submissionData, setSubmissionData] = useState<unknown>(null);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (filledForm: FormSubmissionData) => {
        setSubmissionData(filledForm.data);
        setIsValid(filledForm.isValid);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await submitSurvey({
                survey_id: savedSurvey.id,
                submission_json: submissionData,
                verification_token: token ? token : '',
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
            setIsSubmitting(true);
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
            <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isValid || isLoggedIn || isSubmitting}
                        onClick={() => handleSubmit()}
                    >
                        Submit Survey
                        {isSubmitting && <CircularProgress sx={{ marginLeft: 1 }} size={20} />}
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
