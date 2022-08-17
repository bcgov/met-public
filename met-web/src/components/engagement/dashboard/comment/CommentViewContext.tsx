import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getEngagement } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { getErrorMessage } from 'utils';
import { fetchComments } from 'services/commentService';
import { Comment } from 'models/comment';

export interface EngagementCommentContextProps {
    engagement: Engagement | null;
    comments: Comment[];
    isEngagementLoading: boolean;
    isCommentsListLoading: boolean;
}

export type EngagementParams = {
    engagementId: string;
};

export const CommentViewContext = createContext<EngagementCommentContextProps>({
    engagement: null,
    isEngagementLoading: true,
    isCommentsListLoading: true,
    comments: [],
});

export const CommentViewProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [isEngagementLoading, setEngagementLoading] = useState(true);
    const [isCommentsListLoading, setIsCommentsListLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);

    const validateEngagement = (engagementToValidate: Engagement) => {
        const isClosed = engagementToValidate?.submission_status === SubmissionStatus.Closed;

        if (!isClosed) {
            throw new Error('Engagement is not yet closed');
        }
    };
    useEffect(() => {
        const fetchEngagement = async () => {
            if (isNaN(Number(engagementId))) {
                navigate('/');
                return;
            }
            try {
                const result = await getEngagement(Number(engagementId));
                validateEngagement(result);
                setEngagement({ ...result });
                setEngagementLoading(false);
            } catch (error) {
                console.log(error);
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: getErrorMessage(error) || 'Error occurred while fetching Engagement information',
                    }),
                );
                navigate('/');
            }
        };
        fetchEngagement();
    }, [engagementId]);

    const callFetchComments = async () => {
        try {
            const surveyId = engagement?.surveys[0]?.id;
            if (isNaN(Number(surveyId))) {
                throw new Error('Invalid survey id');
            }

            const fetchedComments = await fetchComments({
                survey_id: Number(surveyId),
            });
            setComments(fetchedComments);
            setIsCommentsListLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: getErrorMessage(error) || 'Error occurred while fetching comments',
                }),
            );
            navigate('/');
        }
    };

    useEffect(() => {
        if (engagement) {
            callFetchComments();
        }
    }, [engagement]);

    return (
        <CommentViewContext.Provider
            value={{
                engagement,
                isEngagementLoading,
                comments,
                isCommentsListLoading,
            }}
        >
            {children}
        </CommentViewContext.Provider>
    );
};
