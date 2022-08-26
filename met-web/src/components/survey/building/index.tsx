import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography, Divider, TextField, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from 'components/Form/FormBuilder';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { SurveyParams } from '../types';
import { getSurvey, putSurvey } from 'services/surveyService/form';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import FormBuilderSkeleton from './FormBuilderSkeleton';
import { FormBuilderData } from 'components/Form/types';
import { EngagementStatus } from 'constants/engagementStatus';

const SurveyFormBuilder = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey | null>(null);
    const [formData, setFormData] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    const [isNameFocused, setIsNamedFocused] = useState(false);
    const [name, setName] = useState(savedSurvey ? savedSurvey.name : '');

    const hasEngagement = Boolean(savedSurvey?.engagement);
    const isEngagementDraft = savedSurvey?.engagement?.status_id === EngagementStatus.Draft;
    const hasPublishedEngagement = hasEngagement && !isEngagementDraft;

    useEffect(() => {
        loadSurvey();
    }, []);

    useEffect(() => {
        if (hasPublishedEngagement) {
            dispatch(
                openNotification({
                    severity: 'warning',
                    text: 'Engagement already published. Saving is disabled.',
                }),
            );
        }
    }, [hasPublishedEngagement]);

    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('/survey/listing');
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
            setLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved survey',
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
            await putSurvey({
                id: String(surveyId),
                form_json: formData,
                name: name,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'The survey was successfully built',
                }),
            );

            if (savedSurvey.engagement?.id) {
                navigate(`/engagement/form/${savedSurvey.engagement.id}`);
                return;
            }

            navigate('/survey/listing');
        } catch (error) {
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
                        <Typography
                            variant="h6"
                            onClick={() => {
                                setIsNamedFocused(true);
                            }}
                        >
                            {name}
                        </Typography>
                    ) : (
                        <TextField
                            autoFocus
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            onBlur={(event) => setIsNamedFocused(false)}
                        />
                    )}

                    <IconButton
                        onClick={() => {
                            setIsNamedFocused(true);
                        }}
                        color="info"
                    >
                        <BorderColorIcon />
                    </IconButton>
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleFormChange={handleFormChange} savedForm={savedSurvey?.form_json} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton disabled={!formData || hasPublishedEngagement} onClick={handleSaveForm}>
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate('/survey/listing')}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyFormBuilder;
