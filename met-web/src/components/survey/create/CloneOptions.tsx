import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Stack, Autocomplete, Typography } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { fetchSurveys, getSurveysPage, linkSurvey } from 'services/surveyService/form';
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

    const handleFetchSurveys = async (
        page: number,
        size: number,
        sort_order: 'asc' | 'desc' | undefined,
        search_text?: string,
    ) => {
        try {
            const fetchedSurveys = await getSurveysPage({
                page: page,
                size: size,
                sort_order: sort_order,
                search_text: search_text,
            });
            setAvailableSurveys(fetchedSurveys.items);
            setLoadingSurveys(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };

    const handleFetchEngagements = async (
        page: number,
        size: number,
        sort_order: 'asc' | 'desc' | undefined,
        search_text?: string,
    ) => {
        try {
            const fetchedEngagements = await getEngagements({
                page: page,
                size: size,
                sort_order: sort_order,
                search_text: search_text,
            });
            console.log('FETCH!');
            console.log(fetchedEngagements);
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
        if (!availableSurveys) {
            handleFetchSurveys(1, 10, 'asc', '');
        }
    }, [availableSurveys]);

    useEffect(() => {
        if (!availableEngagements) {
            handleFetchEngagements(1, 10, 'asc', '');
        }
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
                <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>
                    Select Engagement <Typography sx={{ ml: 1, color: '#ACA9A9' }}>(optional)</Typography>
                </MetLabel>

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
                            onChange={(e) => {
                                handleFetchEngagements(1, 10, 'asc', e.target.value);
                            }}
                        />
                    )}
                    getOptionLabel={(engagement: Engagement) => engagement.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, engagement: Engagement | null) => {
                        setSelectedEngagement(engagement);
                        if (engagement !== null) setSelectedSurvey(engagement.surveys[0]);
                    }}
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
                            value={selectedSurvey != null ? selectedSurvey.name : ''}
                            InputLabelProps={{
                                shrink: false,
                            }}
                            onChange={(e) => {
                                handleFetchSurveys(1, 10, 'asc', e.target.value);
                            }}
                            fullWidth
                        />
                    )}
                    getOptionLabel={(survey: Survey) => (selectedSurvey ? selectedSurvey.name : survey.name)}
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
