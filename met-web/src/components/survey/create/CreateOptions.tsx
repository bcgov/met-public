import React, { useContext, useState } from 'react';
import { Grid, TextField, Stack, CircularProgress } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { hasKey } from 'utils';
import { postSurvey } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';

export const CreateOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { surveyForm, handleSurveyFormChange, engagementToLink } = useContext(CreateSurveyContext);
    const { name } = surveyForm;

    const initialFormError = {
        name: false,
    };
    const [formError, setFormError] = useState(initialFormError);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleSurveyFormChange({
            ...surveyForm,
            [e.target.name]: e.target.value,
        });

        if (hasKey(formError, e.target.name) && formError[e.target.name]) {
            setFormError({
                ...formError,
                [e.target.name]: false,
            });
        }
    };

    const validate = () => {
        setFormError({
            name: !surveyForm.name,
        });
        return Object.values(surveyForm).some((errorExists) => errorExists);
    };

    const handleSaveClick = async () => {
        if (!validate()) {
            return;
        }

        try {
            setIsSaving(true);
            const createdSurvey = await postSurvey({
                name: surveyForm.name,
                engagement_id: engagementToLink?.id ? String(engagementToLink.id) : undefined,
                form_json: {
                    display: 'form',
                    components: [],
                },
            });

            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey created, please proceed to building it',
                }),
            );
            navigate(`/survey/build/${createdSurvey.id}`);
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
                    error={formError.name}
                    helperText={formError.name ? 'Name must be specified' : ' '}
                />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton onClick={handleSaveClick} disabled={isSaving}>
                        {'Save & Continue'}
                        {isSaving && <CircularProgress sx={{ marginLeft: 1 }} size={20} />}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
