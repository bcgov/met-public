import React, { createContext, useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getSurvey } from 'services/surveyService';
import { SurveyForm } from './SurveyForm';
import { Link as MuiLink } from '@mui/material';

interface SubmitSurveyContext {
    savedSurvey: Survey;
    isLoading: boolean;
}

const initialSurvey = {
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
};
export const ActionContext = createContext<SubmitSurveyContext>({
    savedSurvey: initialSurvey,
    isLoading: true,
});

interface SurveyForm {
    name: string;
    structure?: unknown;
}

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>(initialSurvey);
    const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(false);
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
        <ActionContext.Provider
            value={{
                savedSurvey,
                isLoading,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
