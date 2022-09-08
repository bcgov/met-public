import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getEngagement } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import { SubmissionStatus } from 'constants/engagementStatus';
import { getErrorMessage } from 'utils';
import { getCommentsPage } from 'services/commentService';
import { Comment } from 'models/comment';
import { PageInfo, PaginationOptions } from 'components/common/Table/types';

export interface EngagementCommentContextProps {
    engagement: Engagement | null;
    comments: Comment[];
    isEngagementLoading: boolean;
    isCommentsListLoading: boolean;
    paginationOptions: PaginationOptions<Comment>;
    pageInfo: PageInfo;
    handleChangePagination: (_paginationOptions: PaginationOptions<Comment>) => void;
    tableLoading: boolean;
}

export type EngagementParams = {
    engagementId: string;
};

const initialPaginationOptions = {
    page: 1,
    size: 10,
};
const initialTableLoading = {
    total: 0,
};
export const CommentViewContext = createContext<EngagementCommentContextProps>({
    engagement: null,
    isEngagementLoading: true,
    isCommentsListLoading: true,
    comments: [],
    paginationOptions: { page: 0, size: 10 },
    pageInfo: { total: 0 },
    handleChangePagination: (_paginationOptions: PaginationOptions<Comment>) => {
        throw new Error('Unimplemented');
    },
    tableLoading: false,
});

export const CommentViewProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [isEngagementLoading, setEngagementLoading] = useState(true);
    const [isCommentsListLoading, setIsCommentsListLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Comment>>(initialPaginationOptions);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialTableLoading);
    const [tableLoading, setTableLoading] = useState(true);

    const { page, size } = paginationOptions;

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
            setTableLoading(true);
            const response = await getCommentsPage({
                survey_id: Number(surveyId),
                page,
                size,
            });
            setComments(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
            if (isCommentsListLoading) {
                setIsCommentsListLoading(false);
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: getErrorMessage(error) || 'Error occurred while fetching comments',
                }),
            );
            setTableLoading(false);
        }
    };

    const handleChangePagination = (paginationOptions: PaginationOptions<Comment>) => {
        setPaginationOptions(paginationOptions);
    };

    useEffect(() => {
        if (engagement) {
            callFetchComments();
        }
    }, [engagement, paginationOptions]);

    return (
        <CommentViewContext.Provider
            value={{
                engagement,
                isEngagementLoading,
                comments,
                isCommentsListLoading,
                paginationOptions,
                pageInfo,
                handleChangePagination,
                tableLoading,
            }}
        >
            {children}
        </CommentViewContext.Provider>
    );
};
