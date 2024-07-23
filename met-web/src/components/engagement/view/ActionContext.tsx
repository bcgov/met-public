import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useRouteLoaderData, useRevalidator } from 'react-router-dom';
import { patchEngagement } from '../../../services/engagementService';
import { createDefaultEngagement, Engagement } from '../../../models/engagement';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Widget } from 'models/widget';
import { SubmissionStatus } from 'constants/engagementStatus';
import { verifyEmailVerification } from 'services/emailVerificationService';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { getEngagementIdBySlug } from 'services/engagementSlugService';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';

interface EngagementSchedule {
    id: number;
    status_id: number;
    scheduled_date: string;
}

interface UnpublishEngagementParams {
    id: number;
    status_id: number;
}

export interface EngagementViewContext {
    savedEngagement: Engagement;
    isEngagementLoading: boolean;
    isWidgetsLoading: boolean;
    scheduleEngagement: (_engagement: EngagementSchedule) => Promise<Engagement>;
    unpublishEngagement: ({ id, status_id }: UnpublishEngagementParams) => Promise<void>;
    engagementWidgets: Widget[];
    mockStatus: SubmissionStatus;
    updateMockStatus: (status: SubmissionStatus) => void;
    content: string;
    richContent: string;
}

export type EngagementParams = {
    engagementId?: string;
    token?: string;
    slug?: string;
};

export const ActionContext = createContext<EngagementViewContext>({
    scheduleEngagement: (_engagement: EngagementSchedule): Promise<Engagement> => {
        return Promise.reject(Error('not implemented'));
    },
    unpublishEngagement: (_unpublishEngagementData: UnpublishEngagementParams): Promise<void> => {
        return Promise.reject(Error('not implemented'));
    },
    savedEngagement: createDefaultEngagement(),
    isEngagementLoading: true,
    isWidgetsLoading: true,
    engagementWidgets: [],
    mockStatus: SubmissionStatus.Upcoming,
    updateMockStatus: (status: SubmissionStatus) => {
        /* nothing returned */
    },
    content: '',
    richContent: '',
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId: engagementIdParam, token, slug } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const revalidator = useRevalidator();
    const [engagementId, setEngagementId] = useState<number | null>(
        engagementIdParam ? Number(engagementIdParam) : null,
    );
    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [mockStatus, setMockStatus] = useState(savedEngagement.submission_status);
    const [engagementWidgets, setEngagementWidgets] = useState<Widget[]>([]);
    const [isEngagementLoading, setEngagementLoading] = useState(true);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
    const [content, setContent] = useState('');
    const [richContent, setRichContent] = useState('');

    const { engagement } = useRouteLoaderData('single-engagement') as { engagement: Promise<Engagement> };
    const { contentSummary } = useRouteLoaderData('single-engagement') as {
        contentSummary: Promise<EngagementSummaryContent[]>;
    };
    const { widgets } = useRouteLoaderData('single-engagement') as { widgets: Promise<Widget[]> };

    // Load the engagement from the shared individual engagement loader and watch the engagement variable for any changes.
    useEffect(() => {
        engagement.then((result) => {
            if (!engagementId && slug) {
                return;
            }
            if (isNaN(Number(engagementId))) {
                navigate('/not-found');
                return;
            }
            setSavedEngagement(result);
            setEngagementLoading(false);
        });
    }, [engagement]);

    // Load the widgets from the shared individual engagement loader and watch the engagement variable for any changes.
    useEffect(() => {
        if (!engagementId && slug) {
            return;
        }
        widgets.then((result) => {
            setEngagementWidgets(result);
            setIsWidgetsLoading(false);
        });
    }, [widgets]);

    // Load the engagement's summary from the shared individual engagement loader and watch the summary variable for any changes.
    useEffect(() => {
        contentSummary.then((result: EngagementSummaryContent[]) => {
            if ((!engagementId && slug) || !result.length) {
                return;
            }
            const selectedEngagement = result[0];
            setContent(selectedEngagement.content);
            setRichContent(selectedEngagement.rich_content);
            setEngagementLoading(false);
        });
    }, [contentSummary]);

    useEffect(() => {
        verifySubscribeToken();
    }, [token]);

    useEffect(() => {
        setMockStatus(savedEngagement.submission_status);
    }, [savedEngagement]);

    const verifySubscribeToken = async () => {
        try {
            if (!token) {
                return;
            }
            await verifyEmailVerification(token);
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: 'Subscribed Successfully',
                        subText: [
                            {
                                text: 'Your email has been verified. You will now receive news and updates from us.',
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Subscribing to Engagement' }));
            return Promise.reject(error);
        }
    };

    const scheduleEngagement = async (engagement: EngagementSchedule): Promise<Engagement> => {
        try {
            const updateResult = await patchEngagement(engagement);
            revalidator.revalidate();
            setEngagementLoading(false);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            return Promise.resolve(updateResult);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            return Promise.reject(error);
        }
    };

    const unpublishEngagement = async ({ id, status_id }: UnpublishEngagementParams): Promise<void> => {
        try {
            await patchEngagement({
                id,
                status_id,
            });
            setEngagementLoading(true);
            revalidator.revalidate();
            setEngagementLoading(false);
            dispatch(openNotification({ severity: 'success', text: 'Engagement unpublished successfully' }));
            return Promise.resolve();
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error unpublishing engagement' }));
            return Promise.reject(error);
        }
    };

    const updateMockStatus = (status: SubmissionStatus) => {
        setMockStatus(status);
    };

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
        // revalidator.revalidate();
    }, [engagementId]);

    useEffect(() => {
        // revalidator.revalidate();
    }, [savedEngagement]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                isEngagementLoading,
                scheduleEngagement,
                engagementWidgets,
                isWidgetsLoading,
                updateMockStatus,
                mockStatus,
                unpublishEngagement,
                content,
                richContent,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
