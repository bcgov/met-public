import React, { useContext, useState } from 'react';
import { Skeleton, Grid, Stack } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { FormSubmissionData } from 'components/Form/types';
import { useAppSelector } from 'hooks';
import { PrimaryButton, SecondaryButton } from 'components/common';
import { SurveyFormProps } from '../types';
import { When } from 'react-if';
import { useAppTranslation } from 'hooks';

export const SurveyForm = ({ handleClose }: SurveyFormProps) => {
    const { t: translate } = useAppTranslation();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { isSurveyLoading, savedSurvey, handleSubmit, isSubmitting } = useContext(ActionContext);
    const [submissionData, setSubmissionData] = useState<unknown>(null);
    const [isValid, setIsValid] = useState(false);

    const handleChange = (filledForm: FormSubmissionData) => {
        setSubmissionData(filledForm.data);
        setIsValid(filledForm.isValid);
    };

    if (isSurveyLoading) {
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
                <FormSubmit
                    savedForm={savedSurvey.form_json}
                    handleFormChange={handleChange}
                    handleFormSubmit={handleSubmit}
                />
            </Grid>
            <When condition={savedSurvey.form_json?.display === 'form'}>
                <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <Stack
                        direction={{ md: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <SecondaryButton onClick={() => handleClose()}>
                            {translate('surveySubmit.surveyForm.button.cancel')}
                        </SecondaryButton>
                        <PrimaryButton
                            disabled={!isValid || isLoggedIn || isSubmitting}
                            onClick={() => handleSubmit(submissionData)}
                            loading={isSubmitting}
                        >
                            {translate('surveySubmit.surveyForm.button.submit')}
                        </PrimaryButton>
                    </Stack>
                </Grid>
            </When>
        </Grid>
    );
};
