import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAppDispatch } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getSubmissionByToken, updateSubmission } from 'services/submissionService';
import { Engagement } from 'models/engagement';
import { PublicSubmission } from 'models/surveySubmission';

type EditSurveyParams = {
    token: string;
    engagementId: string;
};

interface EditSurveyContext {
    token?: string;
    isTokenValid: boolean;
    handleSubmit: () => void;
    isSubmitting: boolean;
    savedEngagement: Engagement | null;
    isLoading: boolean;
    loadEngagement: null | (() => void);
    submission: PublicSubmission | null;
    setSubmission: Dispatch<SetStateAction<PublicSubmission | null>>;
}

export const ActionContext = createContext<EditSurveyContext>({
    isTokenValid: true,
    handleSubmit: () => {
        return;
    },
    setSubmission: () => {
        return;
    },
    isSubmitting: false,
    savedEngagement: null,
    isLoading: true,
    loadEngagement: null,
    submission: null,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { engagementId, token } = useParams<EditSurveyParams>();
    const [isTokenValid, setTokenValid] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submission, setSubmission] = useState<PublicSubmission | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await loadEngagement();
        await verifyToken();
        await loadSubmission();
        setIsLoading(false);
    };

    const verifyToken = async () => {
        if (!token) {
            navigate(`/404`);
            return;
        }

        try {
            const verification = await getEmailVerification(token);
            if (!verification) {
                throw new Error('Invalid token');
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Verification token is invalid.',
                }),
            );
            setTokenValid(false);
        }
    };

    const loadSubmission = async () => {
        if (!token || !isTokenValid) {
            return;
        }

        try {
            const loadedSubmission = await getSubmissionByToken(token);
            if (loadedSubmission) {
                if (loadedSubmission.engagement_id !== Number(engagementId)) {
                    throw 'Invalid engagementId';
                }
                setSubmission(loadedSubmission);
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading your answers',
                }),
            );
        }
    };

    const loadEngagement = async () => {
        if (isNaN(Number(engagementId))) {
            navigate('/404');
            return;
        }

        try {
            const loadedEngagement = await getEngagement(Number(engagementId));
            setSavedEngagement(loadedEngagement);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading engagement',
                }),
            );
        }   
    };

    const handleSubmit = async () => {
        if (!token || !isTokenValid) {
            return;
        }

        try {
            setIsSubmitting(true);
            await updateSubmission(token, {
                comments: submission?.comments ?? [],
            });

            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey was successfully updated',
                }),
            );
            navigate(`/engagements/${savedEngagement?.id}/view`, {
                state: {
                    open: true,
                },
            });
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred during survey update',
                }),
            );
            verifyToken();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionContext.Provider
            value={{
                token,
                isTokenValid,
                handleSubmit,
                isSubmitting,
                savedEngagement,
                isLoading,
                loadEngagement,
                submission,
                setSubmission,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
