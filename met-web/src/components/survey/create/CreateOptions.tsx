import React, { useContext, useState } from 'react';
import { Grid, TextField, Stack, Autocomplete } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { postSurvey } from 'services/surveyService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';

enum SurveyType {
    Single = 'single',
    Multi = 'multi',
}

export const CreateOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyForm, handleSurveyFormChange, engagementToLink } = useContext(CreateSurveyContext);
    const { name } = surveyForm;
    const initialFormError = {
        name: false,
    };
    const [surveyType, setSurveyType] = useState<SurveyType | null>(SurveyType.Single);
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
                form_json: {
                    display: surveyType === 'multi' ? 'wizard' : 'form',
                    components: [],
                },
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
                <MetLabel sx={{ marginBottom: '2px' }}>Select Survey Type</MetLabel>
                <Autocomplete
                    id="survey-type-selector"
                    options={[SurveyType.Single, SurveyType.Multi]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                        />
                    )}
                    size="small"
                    getOptionLabel={(type: SurveyType) => type}
                    value={surveyType}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, type: SurveyType | null) =>
                        setSurveyType(type)
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton onClick={handleSaveClick} loading={isSaving}>
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
