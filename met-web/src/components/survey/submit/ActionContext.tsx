import React, { createContext, useState, useEffect } from 'react';
import { createDefaultSurvey, Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getSurvey } from 'services/surveyService/form';

interface SubmitSurveyContext {
    savedSurvey: Survey;
    isLoading: boolean;
}

export const ActionContext = createContext<SubmitSurveyContext>({
    savedSurvey: createDefaultSurvey(),
    isLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>(createDefaultSurvey());
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
