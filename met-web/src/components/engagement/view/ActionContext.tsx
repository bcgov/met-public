import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement, putEngagement } from '../../../services/engagementService';
import { Engagement } from '../../../models/engagement';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EngagementViewContext {
    savedEngagement: Engagement;
    engagementLoading: boolean;
    publishEngagement: (_engagement: Engagement) => Promise<Engagement>;
}

export type EngagementParams = {
    engagementId: string;
};

export const ActionContext = createContext<EngagementViewContext>({
    publishEngagement: (_engagement: Engagement): Promise<Engagement> => {
        return Promise.reject();
    },
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        engagement_status: { id: 0, status_name: '' },
        surveys: [],
    },
    engagementLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        engagement_status: { id: 0, status_name: '' },
        surveys: [],
    });
    const [engagementLoading, setEngagementLoading] = useState(true);

    const publishEngagement = async (engagement: Engagement): Promise<Engagement> => {
        try {
            const result = await putEngagement(engagement);
            setSavedEngagement({ ...result });
            setEngagementLoading(false);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            return Promise.resolve(result);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            console.log(error);
            return Promise.reject(error);
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
                setSavedEngagement({ ...result });
                setEngagementLoading(false);
            } catch (error) {
                console.log(error);
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Error occurred while fetching Engagement information',
                    }),
                );
                navigate('/');
            }
        };
        fetchEngagement();
    }, [engagementId]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                engagementLoading,
                publishEngagement,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
