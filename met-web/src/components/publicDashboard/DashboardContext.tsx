import React, { createContext, useEffect, useState } from 'react';
import { SubmissionStatus } from 'constants/engagementStatus';
import { useAppDispatch, useAppSelector } from 'hooks';
import { Engagement, createDefaultEngagement } from 'models/engagement';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement } from 'services/engagementService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getErrorMessage } from 'utils';
import { getEngagementIdBySlug } from 'services/engagementSlugService';

export interface DashboardContextState {
    engagement: Engagement;
    isEngagementLoading: boolean;
}

export const DashboardContext = createContext<DashboardContextState>({
    engagement: createDefaultEngagement(),
    isEngagementLoading: true,
});

interface DashboardContextProviderProps {
    children: React.ReactNode;
}

type EngagementParams = {
    engagementId?: string;
    slug?: string;
};

export const DashboardContextProvider = ({ children }: DashboardContextProviderProps) => {
    const { engagementId: engagementIdParam, slug } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);

    const [engagementId, setEngagementId] = useState<number | null>(
        engagementIdParam ? Number(engagementIdParam) : null,
    );

    const [engagement, setEngagement] = useState<Engagement>(createDefaultEngagement());
    const [isEngagementLoading, setEngagementLoading] = useState(true);

    const validateEngagement = (engagementToValidate: Engagement) => {
        // submission status e.g. of pending or draft will have id less than of Open
        const neverOpened = [SubmissionStatus.Upcoming].includes(engagementToValidate?.submission_status);

        if (neverOpened) {
            throw new Error('Engagement has not yet been opened');
        }

        const isClosed = engagementToValidate?.submission_status === SubmissionStatus.Closed;
        const canAccessDashboard = !roles.includes('access_dashboard');

        /* check to ensure that users without the role access_dashboard can access the dashboard only after 
        the engagement is closed*/
        if (!isClosed && canAccessDashboard) {
            throw new Error('Engagement is not yet closed');
        }
    };

    const fetchEngagement = async () => {
        if (!engagementId && slug) {
            return;
        }
        if (isNaN(Number(engagementId))) {
            navigate('/404');
            return;
        }
        try {
            const result = await getEngagement(Number(engagementId));
            validateEngagement(result);
            setEngagement({ ...result });
            setEngagementLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: getErrorMessage(error) || 'Error occurred while fetching Engagement information',
                }),
            );
        }
    };
    useEffect(() => {
        fetchEngagement();
    }, [engagementId]);

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

    return (
        <DashboardContext.Provider
            value={{
                engagement,
                isEngagementLoading,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
