import React, { createContext, useState, useEffect } from 'react';
import { createDefaultSurvey, Survey } from 'models/survey';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getEmailVerification } from 'services/emailVerificationService';
import { getSurvey } from 'services/surveyService/form';
import { submitSurvey } from 'services/surveyService/submission';

interface SubmitSurveyContext {
    savedSurvey: Survey;
    isLoading: boolean;
    token?: string;
    isTokenValid: boolean;
    handleSubmit: (submissionData: unknown) => void;
    isSubmitting: boolean;
}

export const ActionContext = createContext<SubmitSurveyContext>({
    savedSurvey: createDefaultSurvey(),
    isLoading: true,
    isTokenValid: true,
    handleSubmit: (_submissionData: unknown) => {
        return;
    },
    isSubmitting: false,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { surveyId, token } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>(createDefaultSurvey());
    const [isLoading, setIsLoading] = useState(true);
    const [isTokenValid, setTokenValid] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadSurvey();
    }, []);

    const handleSubmit = async (submissionData: unknown) => {
        try {
            setIsSubmitting(true);
            await submitSurvey({
                survey_id: savedSurvey.id,
                submission_json: submissionData,
                verification_token: token ? token : '',
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey was successfully submitted',
                }),
            );
            navigate(`/engagement/view/${savedSurvey.engagement.id}`, {
                state: {
                    open: true,
                },
            });
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred during survey submission',
                }),
            );
            setIsSubmitting(false);
            verifyToken();
        }
    };

    const verifyToken = async () => {
        try {
            if (!token) {
                navigate(`/404`);
                return;
            }
            const verification = await getEmailVerification(token);
            if (!verification || verification.survey_id !== Number(surveyId)) {
                throw new Error('verification not found or does not match survey');
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Verification token is invalid.',
                }),
            );
            setTokenValid(false);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('/404');
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
            if (!isLoggedIn) {
                verifyToken();
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved survey',
                }),
            );
        }
    };

    return (
        <ActionContext.Provider
            value={{
                savedSurvey,
                isLoading,
                token,
                isTokenValid,
                handleSubmit,
                isSubmitting,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
