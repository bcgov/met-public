import React, { useContext, useState } from 'react';
import { Skeleton, Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { FormSubmissionData } from 'components/Form/types';
import { useAppSelector } from 'hooks';
import { PrimaryButton, SecondaryButton } from 'components/common';
import { SurveyFormProps } from '../types';

export const SurveyForm = ({ handleClose }: SurveyFormProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { isLoading, savedSurvey, handleSubmit, isSubmitting } = useContext(ActionContext);
    const [submissionData, setSubmissionData] = useState<unknown>(null);
    const [isValid, setIsValid] = useState(false);

    const handleChange = (filledForm: FormSubmissionData) => {
        setSubmissionData(filledForm.data);
        setIsValid(filledForm.isValid);
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
            <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    {isSmallScreen ? (
                        <>
                            <PrimaryButton
                                disabled={!isValid || isLoggedIn || isSubmitting}
                                onClick={() => handleSubmit(submissionData)}
                                loading={isSubmitting}
                            >
                                Submit Survey
                            </PrimaryButton>
                            <SecondaryButton onClick={() => handleClose()}>Cancel</SecondaryButton>
                        </>
                    ) : (
                        <>
                            <SecondaryButton onClick={() => handleClose()}>Cancel</SecondaryButton>
                            <PrimaryButton
                                disabled={!isValid || isLoggedIn || isSubmitting}
                                onClick={() => handleSubmit(submissionData)}
                                loading={isSubmitting}
                            >
                                Submit Survey
                            </PrimaryButton>
                        </>
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
};
