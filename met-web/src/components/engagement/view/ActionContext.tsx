import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement, putEngagement } from '../../../services/engagementService';
import { createDefaultEngagement, Engagement } from '../../../models/engagement';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EngagementViewContext {
    savedEngagement: Engagement;
    isEngagementLoading: boolean;
    scheduleEngagement: (_engagement: Engagement) => Promise<Engagement>;
}

export type EngagementParams = {
    engagementId: string;
};

export const ActionContext = createContext<EngagementViewContext>({
    scheduleEngagement: (_engagement: Engagement): Promise<Engagement> => {
        return Promise.reject();
    },
    savedEngagement: createDefaultEngagement(),
    isEngagementLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [isEngagementLoading, setEngagementLoading] = useState(true);

    const scheduleEngagement = async (engagement: Engagement): Promise<Engagement> => {
        try {
            const updateResult = await putEngagement(engagement);
            const getResult = await getEngagement(Number(engagementId));
            setSavedEngagement({ ...getResult });
            setEngagementLoading(false);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            return Promise.resolve(updateResult);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            console.log(error);
            return Promise.reject(error);
        }
    };

    useEffect(() => {
        const fetchEngagement = async () => {
            if (isNaN(Number(engagementId))) {
                navigate('/404');
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
            }
        };
        fetchEngagement();
    }, [engagementId]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                isEngagementLoading,
                scheduleEngagement,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
