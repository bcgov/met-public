import React, { useEffect, useState } from 'react';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from 'components/Form/FormBuilder';
import ClearIcon from '@mui/icons-material/Clear';
import { SurveyParams } from '../types';
import { getSurvey, putSurvey } from 'services/surveyService/form';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetPageGridContainer } from 'components/common';
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

    const hasEngagement = !!savedSurvey.engagement;
    const isEngagementDraft = savedSurvey.engagement?.status_id == EngagementStatus.Draft;

    if (hasEngagement && !isEngagementDraft) {
        dispatch(
            openNotification({
                severity: 'warning',
                text: 'Engagement already published. Saving is disabled.',
            }),
        );
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
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{savedSurvey?.name || ''}</Typography>
                    <ClearIcon />
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleFormChange={handleFormChange} savedForm={savedSurvey?.form_json} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" disabled={!formData || hasPublishedEngagement} onClick={handleSaveForm}>
                        {'Save & Continue'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/survey/listing')}>
                        Cancel
                    </Button>
                </Stack>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyFormBuilder;
