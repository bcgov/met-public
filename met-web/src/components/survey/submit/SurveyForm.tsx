import React, { useContext, useState } from 'react';
import { Skeleton, Grid, Stack, CircularProgress } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { useNavigate } from 'react-router-dom';
import { FormSubmissionData } from 'components/Form/types';
import { useAppSelector } from 'hooks';
import { PrimaryButton, SecondaryButton } from 'components/common';

export const SurveyForm = () => {
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { isLoading, savedSurvey, handleSubmit, isSubmitting } = useContext(ActionContext);
    const [submissionData, setSubmissionData] = useState<unknown>(null);
    const [isValid, setIsValid] = useState(false);

    const handleChange = (filledForm: FormSubmissionData) => {
        setSubmissionData(filledForm.data);
        setIsValid(filledForm.isValid);
    };

    const submit = (submissionData: unknown) => {
        const submitStatus = handleSubmit(submissionData);

        if (submitStatus == 'success')
            navigate(`/engagement/view/${savedSurvey.engagement.id}`, {
                state: {
                    open: true,
                    mainText: '',
                    subTextArray: [
                        'We have successfully submitted your answers.',
                        'We appreciate the time you took to help our community.',
                    ],
                },
            });
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
                    <SecondaryButton onClick={() => navigate('/')}>Cancel</SecondaryButton>
                    <PrimaryButton
                        disabled={!isValid || isLoggedIn || isSubmitting}
                        onClick={() => submit(submissionData)}
                    >
                        Submit Survey
                        {isSubmitting && <CircularProgress sx={{ marginLeft: 1 }} size={20} />}
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
