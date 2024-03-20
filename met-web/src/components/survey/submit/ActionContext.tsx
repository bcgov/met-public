import React, { createContext, useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { createDefaultSurvey, Survey } from 'models/survey';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SurveyParams } from '../types';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getSurvey } from 'services/surveyService';
import { submitSurvey } from 'services/submissionService';
import { Engagement, createDefaultEngagement } from 'models/engagement';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { useAppTranslation } from 'hooks';

interface SubmitSurveyContext {
    savedSurvey: Survey;
    isSurveyLoading: boolean;
    token?: string;
    isTokenValid: boolean;
    handleSubmit: (submissionData: unknown) => void;
    isSubmitting: boolean;
    savedEngagement: Engagement | null;
    isEngagementLoading: boolean;
    loadEngagement: null | (() => void);
    slug: string;
}

export const ActionContext = createContext<SubmitSurveyContext>({
    savedSurvey: createDefaultSurvey(),
    isSurveyLoading: true,
    isTokenValid: true,
    handleSubmit: (_submissionData: unknown) => {
        return;
    },
    isSubmitting: false,
    savedEngagement: null,
    isEngagementLoading: true,
    loadEngagement: null,
    slug: '',
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { t: translate } = useAppTranslation();
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { surveyId, token } = useParams<SurveyParams>();
    const [savedSurvey, setSavedSurvey] = useState<Survey>(createDefaultSurvey());
    const [isSurveyLoading, setIsSurveyLoading] = useState(true);
    const [isTokenValid, setTokenValid] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);
    const [isEngagementLoading, setIsEngagementLoading] = useState(true);
    const [slug, setSlug] = useState<string>('');

    const verifyToken = async () => {
        if (isLoggedIn) {
            setIsSurveyLoading(false);
            return;
        }

        if (!token) {
            navigate(`/not-found`);
            return;
        }

        try {
            const verification = await getEmailVerification(token);
            if (!verification || verification.survey_id !== Number(surveyId)) {
                throw new Error(translate('surveySubmit.surveySubmitNotification.verificationError'));
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveySubmit.surveySubmitNotification.invalidToken'),
                }),
            );
            setTokenValid(false);
        } finally {
            setIsSurveyLoading(false);
        }
    };

    useEffect(() => {
        loadSurvey();
    }, []);
    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('/not-found');
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveySubmit.surveySubmitNotification.invalidSurvey'),
                }),
            );
            return;
        }
        try {
            const loadedSurvey = await getSurvey(Number(surveyId));
            setSavedSurvey(loadedSurvey);
            setIsSurveyLoading(false);
            verifyToken();
        } catch (error) {
            if ((error as AxiosError)?.response?.status === 500) {
                navigate('/not-available');
            } else {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: translate('surveySubmit.surveySubmitNotification.surveyError'),
                    }),
                );
                navigate(`/not-available`);
            }
        }
    };

    useEffect(() => {
        if (savedSurvey?.id !== 0) {
            loadEngagement();
        }
    }, [savedSurvey]);
    const loadEngagement = async () => {
        if (isNaN(Number(savedSurvey.engagement_id)) || !savedSurvey.engagement_id) {
            setSavedEngagement({
                ...createDefaultEngagement(),
                name: savedSurvey.name,
            });
            setIsEngagementLoading(false);
            return;
        }

        setIsEngagementLoading(true);
        try {
            const loadedEngagement = await getEngagement(Number(savedSurvey.engagement_id));
            setSavedEngagement(loadedEngagement);
            setIsEngagementLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveySubmit.surveySubmitNotification.engagementError'),
                }),
            );
            setIsEngagementLoading(false);
        }
    };

    const handleFetchSlug = async () => {
        if (!savedSurvey.engagement_id) {
            return;
        }
        try {
            const response = await getSlugByEngagementId(savedSurvey.engagement_id);
            setSlug(response.slug);
        } catch (error) {
            setSlug('');
        }
    };

    useEffect(() => {
        handleFetchSlug();
    }, [savedSurvey.engagement_id]);

    const handleSubmit = async (submissionData: unknown) => {
        try {
            setIsSubmitting(true);
            await submitSurvey({
                survey_id: savedSurvey.id,
                submission_json: submissionData,
                verification_token: token ? token : '',
            });

            window.snowplow('trackSelfDescribingEvent', {
                schema: 'iglu:ca.bc.gov.met/submit-survey/jsonschema/1-0-0',
                data: { survey_id: savedSurvey.id, engagement_id: savedSurvey.engagement_id },
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: translate('surveySubmit.surveySubmitNotification.success'),
                }),
            );
            navigate(`${languagePath}/${slug}`, {
                state: {
                    open: true,
                },
            });
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveySubmit.surveySubmitNotification.submissionError'),
                }),
            );
            setIsSubmitting(false);
            verifyToken();
        }
    };

    return (
        <ActionContext.Provider
            value={{
                savedSurvey,
                isSurveyLoading,
                token,
                isTokenValid,
                handleSubmit,
                isSubmitting,
                savedEngagement,
                isEngagementLoading,
                loadEngagement,
                slug,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
