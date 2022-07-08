import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getSurvey } from 'services/surveyService';
import { SurveyForm } from './SurveyForm';

const SurveySubmit = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState<Survey>({
        id: 0,
        name: '',
        responseCount: 0,
        created_date: '',
        engagement: {
            id: 0,
            name: '',
            description: '',
            rich_description: '',
            status_id: 0,
            start_date: '',
            end_date: '',
            published_date: '',
            user_id: '',
            created_date: '',
            updated_date: '',
            banner_url: '',
            banner_filename: '',
            content: '',
            rich_content: '',
            engagement_status: { id: 0, status_name: '' },
        },
    });

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
            setSurvey(loadedSurvey);
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

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
                <SurveyBanner engagement={survey.engagement} engagementLoading={loading} />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                sx={{ margin: '1em 2em 1em 3em' }}
                spacing={2}
            >
                <Grid item xs={12}>
                    <SurveyForm loading={loading} surveyFormData={survey.form_json} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmit;
