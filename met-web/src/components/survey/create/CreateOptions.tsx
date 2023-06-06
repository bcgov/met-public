import React, { useContext, useState } from 'react';
import { Grid, TextField, Stack, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { postSurvey } from 'services/surveyService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton, MetDescription } from 'components/common';
import { Disclaimer } from './Disclaimer';
import { FORMIO_FORM, FORMIO_WIZARD } from './constants';

export const CreateOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyForm, handleSurveyFormChange, engagementToLink, isDisclaimerChecked } =
        useContext(CreateSurveyContext);
    const { name } = surveyForm;
    const initialFormError = {
        name: false,
    };
    const [multiPageSurvey, setMultiPageSurvey] = useState<boolean>(true);
    const [formError, setFormError] = useState(initialFormError);
    const [isSaving, setIsSaving] = useState(false);
    const getErrorMessage = () => {
        if (name.length > 50) {
            return 'Name must not exceed 50 characters';
        } else if (formError.name && !name) {
            return 'Name must be specified';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleSurveyFormChange({
            ...surveyForm,
            [e.target.name]: e.target.value,
        });
        validate();
    };

    const validate = () => {
        setFormError({
            name: !surveyForm.name || surveyForm.name.length > 50,
        });
        return Object.values(formError).some((errorExists) => errorExists);
    };

    const handleSaveClick = async () => {
        if (validate()) {
            return;
        }
        try {
            setIsSaving(true);
            const createdSurvey = await postSurvey({
                name: surveyForm.name,
                engagement_id: engagementToLink?.id ? String(engagementToLink.id) : undefined,
                display: multiPageSurvey ? FORMIO_WIZARD : FORMIO_FORM,
            });

            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey created, please proceed to building it',
                }),
            );
            navigate(`/surveys/${createdSurvey.id}/build`);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while attempting to save survey',
                }),
            );
            setIsSaving(false);
        }
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={6}>
                <MetLabel>Enter Survey Name</MetLabel>
                <TextField
                    id="survey-name"
                    size="small"
                    variant="outlined"
                    label=" "
                    InputLabelProps={{
                        shrink: false,
                    }}
                    fullWidth
                    name="name"
                    value={name}
                    onChange={handleChange}
                    error={formError.name || name.length > 50}
                    helperText={getErrorMessage()}
                />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={multiPageSurvey}
                                onChange={(e) => {
                                    setMultiPageSurvey(!multiPageSurvey);
                                }}
                            />
                        }
                        label="Multi-page"
                    />
                </FormGroup>
                <MetDescription>
                    The multi-page option will enable you to add one, or many pages to a survey. It will also create a
                    progress bar. If you want to create a 1-page survey, turn off the multi-page toggle.
                </MetDescription>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
                <Disclaimer />
            </Grid>

            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton disabled={!isDisclaimerChecked} onClick={handleSaveClick} loading={isSaving}>
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
