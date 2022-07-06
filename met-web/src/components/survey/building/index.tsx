import React, { useEffect, useState } from 'react';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from 'components/Form/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { SurveyParams } from './types';
import { getSurvey, putSurvey } from 'services/surveyService';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { hasKey } from 'utils';

const SurveyFormBuilder = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>({
        id: 0,
        name: '',
        responseCount: 0,
        created_date: '',
    });

    const [formData, setFormData] = useState<unknown>(null);

    useEffect(() => {
        loadSurvey();
    }, []);

    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('survey/listing');
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

    const handleFormChange = (form: unknown) => {
        if (hasKey(form, 'components')) {
            setFormData(form);
        }
    };

    const handleSaveForm = async () => {
        try {
            await putSurvey({
                id: Number(surveyId),
                form: formData,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'The survey was successfully built',
                }),
            );
            navigate('/survey/listing');
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while saving survey',
                }),
            );
            navigate('/survey/listing');
        }
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Sruvey Name Placeholder</Typography>
                    <ClearIcon />
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleFormChange={handleFormChange} savedForm={savedSurvey.form || []} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" disabled={!formData} onClick={handleSaveForm}>
                        {'Save & Continue'}
                    </Button>
                    <Button variant="outlined">Cancel</Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default SurveyFormBuilder;
