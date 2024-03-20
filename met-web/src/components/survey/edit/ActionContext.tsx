import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAppDispatch } from 'hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getEmailVerification } from 'services/emailVerificationService';
import { getEngagement } from 'services/engagementService';
import { getSubmissionByToken, updateSubmission } from 'services/submissionService';
import { Engagement } from 'models/engagement';
import { PublicSubmission } from 'models/surveySubmission';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { useAppTranslation } from 'hooks';

type EditSurveyParams = {
    token: string;
    engagementId?: string;
    slug?: string;
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
    const { t: translate } = useAppTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { engagementId: engagementIdParam, token, slug } = useParams<EditSurveyParams>();

    const [engagementId, setEngagementId] = useState<number | null>(
        engagementIdParam ? Number(engagementIdParam) : null,
    );
    const [isTokenValid, setTokenValid] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submission, setSubmission] = useState<PublicSubmission | null>(null);

    const handleFetchEngagementIdBySlug = async () => {
        if (!slug) {
            return;
        }
        try {
            const result = await getEngagementIdBySlug(slug);
            setEngagementId(result.engagement_id);
        } catch (error) {
            navigate('/not-found');
        }
    };

    useEffect(() => {
        handleFetchEngagementIdBySlug();
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [engagementId]);

    const fetchData = async () => {
        if (!engagementId && slug) {
            return;
        }
        await loadEngagement();
        await verifyToken();
        await loadSubmission();
        setIsLoading(false);
    };

    const verifyToken = async () => {
        if (!token) {
            navigate(`/not-found`);
            return;
        }

        try {
            const verification = await getEmailVerification(token);
            if (!verification) {
                throw new Error(translate('surveyEdit.surveyEditNotification.invalidToken'));
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveyEdit.surveyEditNotification.verificationError'),
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
                    throw translate('surveyEdit.surveyEditNotification.engagementError');
                }
                setSubmission(loadedSubmission);
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveyEdit.surveyEditNotification.loadedSubmissionError'),
                }),
            );
        }
    };

    const loadEngagement = async () => {
        if (isNaN(Number(engagementId))) {
            navigate('/not-found');
            return;
        }

        try {
            const loadedEngagement = await getEngagement(Number(engagementId));
            setSavedEngagement(loadedEngagement);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('surveyEdit.surveyEditNotification.loadedEngagementError'),
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
                    text: translate('surveyEdit.surveyEditNotification.success'),
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
                    text: translate('surveyEdit.surveyEditNotification.updateSurveyError'),
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
