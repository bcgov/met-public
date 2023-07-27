import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement, patchEngagement } from '../../../services/engagementService';
import { getEngagementMetadata } from '../../../services/engagementMetadataService';
import {
    createDefaultEngagement,
    createDefaultEngagementMetadata,
    Engagement,
    EngagementMetadata,
} from '../../../models/engagement';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Widget } from 'models/widget';
import { useLazyGetWidgetsQuery } from 'apiManager/apiSlices/widgets';
import { SubmissionStatus } from 'constants/engagementStatus';
import { verifyEmailVerification } from 'services/emailVerificationService';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { getEngagementIdBySlug } from 'services/engagementSlugService';

interface EngagementSchedule {
    id: number;
    status_id: number;
    scheduled_date: string;
}

export interface EngagementViewContext {
    savedEngagement: Engagement;
    engagementMetadata: EngagementMetadata;
    isEngagementLoading: boolean;
    isWidgetsLoading: boolean;
    isEngagementMetadataLoading: boolean;
    scheduleEngagement: (_engagement: EngagementSchedule) => Promise<Engagement>;
    widgets: Widget[];
    mockStatus: SubmissionStatus;
    updateMockStatus: (status: SubmissionStatus) => void;
}

export type EngagementParams = {
    engagementId?: string;
    token?: string;
    slug?: string;
};

export const ActionContext = createContext<EngagementViewContext>({
    scheduleEngagement: (_engagement: EngagementSchedule): Promise<Engagement> => {
        return Promise.reject();
    },
    savedEngagement: createDefaultEngagement(),
    engagementMetadata: createDefaultEngagementMetadata(),
    isEngagementLoading: true,
    isWidgetsLoading: true,
    isEngagementMetadataLoading: true,
    widgets: [],
    mockStatus: SubmissionStatus.Upcoming,
    updateMockStatus: (status: SubmissionStatus) => {
        /* nothing returned */
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId: engagementIdParam, token, slug } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [engagementId, setEngagementId] = useState<number | null>(
        engagementIdParam ? Number(engagementIdParam) : null,
    );
    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [engagementMetadata, setEngagementMetadata] = useState<EngagementMetadata>(createDefaultEngagementMetadata());
    const [mockStatus, setMockStatus] = useState(savedEngagement.submission_status);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [isEngagementLoading, setEngagementLoading] = useState(true);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
    const [isEngagementMetadataLoading, setIsEngagementMetadataLoading] = useState(true);

    const [getWidgetsTrigger] = useLazyGetWidgetsQuery();

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
            const getResult = await getEngagement(Number(engagementId));
            setSavedEngagement({ ...getResult });
            setEngagementLoading(false);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            return Promise.resolve(updateResult);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            return Promise.reject(error);
        }
    };

    const updateMockStatus = (status: SubmissionStatus) => {
        setMockStatus(status);
    };

    const fetchEngagement = async () => {
        if (!engagementId && slug) {
            return;
        }
        if (isNaN(Number(engagementId))) {
            navigate('/not-found');
            return;
        }
        try {
            const result = await getEngagement(Number(engagementId));
            setSavedEngagement({ ...result });
            setEngagementLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement information',
                }),
            );
        }
    };

    const fetchWidgets = async () => {
        if (!savedEngagement.id) {
            return;
        }
        try {
            const result = await getWidgetsTrigger(Number(engagementId), true).unwrap();
            setWidgets(result);
            setIsWidgetsLoading(false);
        } catch (error) {
            setIsWidgetsLoading(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement wdigets',
                }),
            );
        }
    };

    const fetchEngagementMetadata = async () => {
        if (!savedEngagement.id) {
            return;
        }
        try {
            const result = await getEngagementMetadata(Number(engagementId));
            setEngagementMetadata(result);
            setIsEngagementMetadataLoading(false);
        } catch (error) {
            setIsEngagementMetadataLoading(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement Metadata',
                }),
            );
        }
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
        fetchEngagement();
    }, [engagementId]);

    useEffect(() => {
        fetchWidgets();
        fetchEngagementMetadata();
    }, [savedEngagement]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                engagementMetadata,
                isEngagementLoading,
                scheduleEngagement,
                widgets,
                isWidgetsLoading,
                isEngagementMetadataLoading,
                updateMockStatus,
                mockStatus,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
