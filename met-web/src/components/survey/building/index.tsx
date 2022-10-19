import React, { useEffect, useState } from 'react';
import { Grid, Stack, Divider, TextField, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from 'components/Form/FormBuilder';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ClearIcon from '@mui/icons-material/Clear';
import { SurveyParams } from '../types';
import { getSurvey, putSurvey } from 'services/surveyService/form';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetHeader3, MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import FormBuilderSkeleton from './FormBuilderSkeleton';
import { FormBuilderData } from 'components/Form/types';
import { EngagementStatus } from 'constants/engagementStatus';
import { getEngagement } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import * as Formio from 'formiojs';

const SurveyFormBuilder = () => {
    Formio.Utils.Evaluator.noeval = true;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey | null>(null);
    const [formData, setFormData] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    const [isNameFocused, setIsNamedFocused] = useState(false);
    const [name, setName] = useState(savedSurvey ? savedSurvey.name : '');
    const [isSaving, setIsSaving] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);

    const hasEngagement = Boolean(savedSurvey?.engagement_id);
    const isEngagementDraft = savedEngagement?.status_id === EngagementStatus.Draft;
    const hasPublishedEngagement = hasEngagement && !isEngagementDraft;

    useEffect(() => {
        loadSurvey();
    }, []);

    useEffect(() => {
        if (savedEngagement && hasPublishedEngagement) {
            dispatch(
                openNotification({
                    severity: 'warning',
                    text: 'Engagement already published. Saving is disabled.',
                }),
            );
        }
    }, [savedEngagement]);

    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('/surveys');
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'The survey id passed was erroneous',
                }),
            );
            return;
        }
        try {
            const loadedSurvey = await getSurvey(Number(surveyId));
            setSavedSurvey(loadedSurvey);
            setName(loadedSurvey.name);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved survey',
                }),
            );
            navigate('/surveys');
        }
    };

    useEffect(() => {
        if (savedSurvey) {
            loadEngagement();
        }
    }, [savedSurvey]);
    const loadEngagement = async () => {
        if (!savedSurvey?.engagement_id) {
            setLoading(false);
            return;
        }

        try {
            const loadedEngagement = await getEngagement(Number(savedSurvey.engagement_id));
            setSavedEngagement(loadedEngagement);
            setLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved engagement data',
                }),
            );
            navigate('/survey/listing');
        }
    };

    const handleFormChange = (form: FormBuilderData) => {
        if (!form.components) {
            return;
        }
        setFormData(form);
    };

    const handleSaveForm = async () => {
        if (!savedSurvey) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Unable to build survey, please reload',
                }),
            );
            return;
        }

        try {
            setIsSaving(true);
            await putSurvey({
                id: String(surveyId),
                form_json: formData,
                name: name,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: savedSurvey.engagement?.id
                        ? `Survey was successfully added to engagement`
                        : 'The survey was successfully built',
                }),
            );
            if (savedSurvey.engagement?.id) {
                navigate(`/engagements/${savedSurvey.engagement.id}/form`);
                return;
            }

            navigate('/surveys');
        } catch (error) {
            setIsSaving(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while saving survey',
                }),
            );
        }
    };

    if (loading) {
        return <FormBuilderSkeleton />;
    }

    return (
        <MetPageGridContainer
            container
            direction="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            item
            xs={12}
            spacing={4}
        >
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center">
                    {!isNameFocused ? (
                        <>
                            <MetHeader3
                                sx={{ p: 0.5 }}
                                onClick={() => {
                                    setIsNamedFocused(true);
                                }}
                            >
                                {name}
                            </MetHeader3>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setIsNamedFocused(!isNameFocused);
                                }}
                                color="info"
                            >
                                <BorderColorIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <TextField
                                autoFocus
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                onBlur={(event) => setIsNamedFocused(false)}
                            />
                            <IconButton
                                onClick={() => {
                                    setIsNamedFocused(!isNameFocused);
                                }}
                                color="info"
                            >
                                <ClearIcon />
                            </IconButton>
                        </>
                    )}
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleFormChange={handleFormChange} savedForm={savedSurvey?.form_json} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton
                        disabled={!formData || hasPublishedEngagement}
                        loading={isSaving}
                        onClick={handleSaveForm}
                    >
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate('/surveys')}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyFormBuilder;
