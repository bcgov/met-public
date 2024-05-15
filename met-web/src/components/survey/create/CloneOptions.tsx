import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Stack, Autocomplete, Typography } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { cloneSurvey, getSurveysPage } from 'services/surveyService';
import { getEngagements } from 'services/engagementService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { Survey } from 'models/survey';
import { Engagement } from 'models/engagement';
import { Disclaimer } from './Disclaimer';

export type EngagementParams = {
    engagementId: string;
};

const PAGE = 1;

const PAGE_SIZE = 2000;

const SORT_ORDER = 'asc';

const CloneOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const searchParams = new URLSearchParams(location.search);
    const engagementId = searchParams.get('engagementId');
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
        isDisclaimerChecked,
        setDisclaimerError,
    } = useContext(CreateSurveyContext);
    const { name } = surveyForm;
    const initialFormError = {
        name: false,
    };
    const [formError, setFormError] = useState(initialFormError);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleSurveyFormChange({
            ...surveyForm,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        setFormError({
            name: !(surveyForm.name && surveyForm.name.length < 50),
        });
        return Object.values(formError).some((errorExists) => errorExists);
    };

    const getErrorMessage = () => {
        if (name.length > 50) {
            return 'Name must not exceed 50 characters';
        } else if (formError.name) {
            return 'Name must be specified';
        }
        return '';
    };

    const handleFetchSurveys = async (page: number, size: number, sort_order: 'asc' | 'desc' | undefined) => {
        try {
            const fetchedSurveys = await getSurveysPage({
                page: page,
                size: size,
                sort_order: sort_order,
                exclude_hidden: true,
            });
            setAvailableSurveys(fetchedSurveys.items);
            setLoadingSurveys(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };

    const handleFetchEngagements = async (page: number, size: number, sort_order: 'asc' | 'desc' | undefined) => {
        try {
            const fetchedEngagements = await getEngagements({
                page: page,
                size: size,
                sort_order: sort_order,
            });
            setAvailableEngagements(fetchedEngagements.items.filter((engagement) => engagement.surveys.length !== 0));
            setLoadingEngagements(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while fetching available engagements' }),
            );
        }
    };

    useEffect(() => {
        handleFetchSurveys(PAGE, PAGE_SIZE, SORT_ORDER);
    }, []);

    useEffect(() => {
        if (!availableEngagements) {
            handleFetchEngagements(PAGE, PAGE_SIZE, SORT_ORDER);
        } else {
            setLoadingEngagements(false);
        }
    }, [availableEngagements]);

    const handleSave = async () => {
        if (!selectedSurvey) {
            dispatch(openNotification({ severity: 'error', text: 'Please select a survey first' }));
            return;
        }
        if (validate()) {
            return;
        }

        if (!isDisclaimerChecked) {
            setDisclaimerError(true);
            return;
        }

        setIsSaving(true);
        try {
            const createdSurvey = await cloneSurvey({
                name: surveyForm.name,
                engagement_id: engagementId ? String(engagementId) : undefined,
                survey_id: selectedSurvey.id,
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
                        />
                    )}
                    size="small"
                    getOptionLabel={(engagement: Engagement) => engagement.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, engagement: Engagement | null) => {
                        setSelectedEngagement(engagement);
                        if (engagement !== null) setSelectedSurvey(engagement.surveys[0]);
                    }}
                    disabled={loadingEngagements}
                />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
                <MetLabel sx={{ marginBottom: '2px' }}>Select Survey</MetLabel>
                <Autocomplete
                    id="survey-selector"
                    options={selectedEngagement ? selectedEngagement.surveys : availableSurveys || []}
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
                    getOptionLabel={(survey: Survey) => survey.name}
                    value={selectedSurvey}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, survey: Survey | null) =>
                        setSelectedSurvey(survey)
                    }
                    disabled={loadingSurveys}
                />
            </Grid>
            <Grid item xs={6}></Grid>
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
                        value={name}
                        onChange={handleChange}
                        error={formError.name || name.length > 50}
                        helperText={getErrorMessage()}
                    />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Disclaimer />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButtonOld onClick={handleSave} loading={isSaving}>
                        {'Save & Continue'}
                    </PrimaryButtonOld>
                    <SecondaryButtonOld onClick={() => navigate(-1)}>Cancel</SecondaryButtonOld>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default CloneOptions;
