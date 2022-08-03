import React, { createContext, useState, useEffect } from 'react';
import { createDefaultSurvey, Survey } from 'models/survey';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getEmailVerification } from 'services/emailVerificationService';
import { getSurvey } from 'services/surveyService/form';

interface SubmitSurveyContext {
    savedSurvey: Survey;
    isLoading: boolean;
    token?: string;
}

export const ActionContext = createContext<SubmitSurveyContext>({
    savedSurvey: createDefaultSurvey(),
    isLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { surveyId, token } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>(createDefaultSurvey());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            verifyToken();
        } else {
            loadSurvey();
        }
    }, []);

    const verifyToken = async () => {
        if (!token) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Verification token is invalid.',
                }),
            );
            navigate('/');
            return;
        }
        try {
            const verification = await getEmailVerification(token);
            if (!verification || verification.survey_id !== Number(surveyId)) {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Verification token is invalid.',
                    }),
                );
                navigate('/');
                return;
            }

            loadSurvey();
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Verification token is invalid.',
                }),
            );
            navigate('/');
        }
    };

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
                token,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
