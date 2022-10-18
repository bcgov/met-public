import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Stack, Autocomplete } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { fetchSurveys, linkSurvey } from 'services/surveyService/form';
import { getEngagements } from 'services/engagementService';
import { postSurvey } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Survey } from 'models/survey';
import { hasKey } from 'utils';
import { Engagement } from 'models/engagement';

const CloneOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
    const [loadingSurveys, setLoadingSurveys] = useState(true);
    const [loadingEngagements, setLoadingEngagements] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        surveyForm,
        handleSurveyFormChange,
        availableSurveys,
        setAvailableSurveys,
        availableEngagements,
        setAvailableEngagements,
        engagementToLink,
    } = useContext(CreateSurveyContext);

    const initialFormError = {
        name: false,
    };
    const [formError, setFormError] = useState(initialFormError);

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

    const handleFetchSurveys = async () => {
        if (!!availableSurveys) {
            setLoadingSurveys(false);
            return;
        }

        try {
            const fetchedSurveys = await fetchSurveys({
                unlinked: true,
            });
            setAvailableSurveys(fetchedSurveys);
            setLoadingSurveys(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };

    const handleFetchEngagements = async () => {
        if (!!availableEngagements) {
            setLoadingEngagements(false);
            return;
        }
        try {
            const fetchedEngagements = await getEngagements({
                page: 1,
                size: 100,
                sort_order: 'asc',
            });
            console.log(fetchedEngagements.items);
            console.log(fetchedEngagements.items.filter((engagement) => engagement.surveys.length !== 0));
            setAvailableEngagements(
                fetchedEngagements.items.filter((engagement, index) => engagement.surveys.length !== 0),
            );
            setLoadingEngagements(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while fetching available engagements' }),
            );
        }
    };

    useEffect(() => {
        handleFetchSurveys();
    }, [availableSurveys]);

    useEffect(() => {
        handleFetchEngagements();
    }, [availableEngagements]);

    const handleSave = async () => {
        if (!selectedSurvey) {
            if (selectedEngagement) return;
            dispatch(openNotification({ severity: 'error', text: 'Please select a survey first' }));
            return;
        }
        setIsSaving(true);
        try {
            const createdSurvey = await postSurvey({
                name: surveyForm.name,
                form_json: selectedEngagement ? selectedEngagement.surveys[0].form_json : selectedSurvey.form_json,
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
                <MetLabel sx={{ marginBottom: '2px' }}>Select Engagement (optional)</MetLabel>
                <Autocomplete
                    id="engagement-selector"
                    options={availableEngagements || []}
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
                    getOptionLabel={(engagement: Engagement) => engagement.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, engagement: Engagement | null) =>
                        setSelectedEngagement(engagement)
                    }
                    disabled={loadingEngagements}
                />
            </Grid>
            <Grid item xs={12}>
                <MetLabel sx={{ marginBottom: '2px' }}>Select Survey</MetLabel>
                <Autocomplete
                    id="survey-selector"
                    options={availableSurveys || []}
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
                    getOptionLabel={(survey: Survey) => survey.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, survey: Survey | null) =>
                        setSelectedSurvey(survey)
                    }
                    disabled={loadingSurveys || selectedEngagement !== null}
                />
            </Grid>
            <Grid item xs={6}>
                <Stack direction="column" spacing={2}>
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
                        value={surveyForm.name}
                        onChange={handleChange}
                        error={formError.name}
                        helperText={formError.name ? 'Name must be specified' : ' '}
                    />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton onClick={handleSave} loading={isSaving}>
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default CloneOptions;
