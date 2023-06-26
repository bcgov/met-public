import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getEngagement } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import { getErrorMessage } from 'utils';
import { getCommentsPage } from 'services/commentService';
import { Comment } from 'models/comment';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { getEngagementIdBySlug } from 'services/engagementSlugService';

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
    engagementId?: string;
    slug?: string;
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
    const { engagementId: engagementIdParam, slug } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [engagementId, setEngagementId] = useState<number | null>(
        engagementIdParam ? Number(engagementIdParam) : null,
    );
    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [isEngagementLoading, setEngagementLoading] = useState(true);
    const [isCommentsListLoading, setIsCommentsListLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Comment>>({
        page: 1,
        size: 10,
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);

    const { page, size } = paginationOptions;

    const handleFetchEngagementIdBySlug = async () => {
        if (!slug) {
            return;
        }
        try {
            const result = await getEngagementIdBySlug(slug);
            setEngagementId(result.engagement_id);
        } catch (error) {
            navigate('/404');
        }
    };

    useEffect(() => {
        handleFetchEngagementIdBySlug();
    }, [slug]);

    const fetchEngagement = async () => {
        if (!engagementId && slug) {
            return;
        }
        if (isNaN(Number(engagementId))) {
            navigate('/');
            return;
        }
        try {
            const result = await getEngagement(Number(engagementId));
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

    useEffect(() => {
        fetchEngagement();
    }, [engagementId]);

    const loadComments = async () => {
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
            loadComments();
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
