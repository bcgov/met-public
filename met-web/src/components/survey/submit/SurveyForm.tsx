import React, { useRef, useState } from 'react';
import { Grid, Stack } from '@mui/material';
import FormSubmit from 'components/Form/FormSubmit';
import { FormSubmissionData } from 'components/Form/types';
import { useAppDispatch, useAppSelector, useAppTranslation } from 'hooks';
import { When } from 'react-if';
import { submitSurvey } from 'services/submissionService';
import { useNavigate, useRouteLoaderData } from 'react-router';
import { Button } from 'components/common/Input';
import { openNotification } from 'services/notificationService/notificationSlice';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { SurveyLoaderData } from '../building/SurveyLoader';

export const SurveyForm = () => {
    const { t: translate } = useAppTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const [submissionData, setSubmissionData] = useState<unknown>(null);

    const initialSet = useRef(false); // Track if the initial state has been set
    const [isValid, setIsValid] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const { survey, verification, slug } = useRouteLoaderData('survey') as SurveyLoaderData;

    const token = verification?.verification_token;

    const handleChange = (filledForm: FormSubmissionData) => {
        if (!initialSet.current) {
            initialSet.current = true;
        } else {
            setIsChanged(true);
        }
        setSubmissionData(filledForm.data);
        setIsValid(filledForm.isValid);
    };

    const navigateToEngagement = () => {
        if (slug) {
            navigate(`/${slug.slug}/${languagePath}`);
        }
    };

    const handleSubmit = async (submissionData: unknown) => {
        try {
            await submitSurvey({
                survey_id: survey.id,
                submission_json: submissionData,
                verification_token: token ?? '',
            });

            try {
                window.snowplow('trackSelfDescribingEvent', {
                    schema: 'iglu:ca.bc.gov.met/submit-survey/jsonschema/1-0-0',
                    data: { survey_id: survey.id, engagement_id: survey.engagement_id },
                });
            } catch (error) {
                console.log('Error while firing snowplow event for survey submission:', error);
            }
            dispatch(
                openNotification({
                    severity: 'success',
                    text: translate('surveySubmit.surveySubmitNotification.success'),
                }),
            );
            if (slug) {
                navigate(`/${slug.slug}/${languagePath}`, {
                    state: {
                        open: true,
                    },
                });
            }
        } catch {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveySubmit.surveySubmitNotification.submissionError'),
                }),
            );
        }
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            padding={'2em 2em 1em 2em'}
        >
            <UnsavedWorkConfirmation blockNavigationWhen={isChanged && !isLoggedIn} />
            <Grid item xs={12}>
                <FormSubmit
                    savedForm={survey.form_json}
                    handleFormChange={handleChange}
                    handleFormSubmit={handleSubmit}
                />
            </Grid>
            <When condition={survey.form_json?.display === 'form'}>
                <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <Stack
                        direction={{ md: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <Button variant="secondary" onClick={() => navigateToEngagement()}>
                            {translate('surveySubmit.surveyForm.button.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            disabled={!isValid || isLoggedIn}
                            onClick={() => handleSubmit(submissionData)}
                        >
                            {translate('surveySubmit.surveyForm.button.submit')}
                        </Button>
                    </Stack>
                </Grid>
            </When>
        </Grid>
    );
};
