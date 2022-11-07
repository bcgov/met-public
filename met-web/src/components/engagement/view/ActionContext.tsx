import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement, patchEngagement } from '../../../services/engagementService';
import { createDefaultEngagement, Engagement } from '../../../models/engagement';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets } from 'services/widgetService';
import { WhoIsListeningWidget, WidgetType } from 'models/widget';
import { getContact } from 'services/contactService';

interface EngagementSchedule {
    id: number;
    status_id: number;
    scheduled_date: string;
}

export interface EngagementViewContext {
    savedEngagement: Engagement;
    isEngagementLoading: boolean;
    scheduleEngagement: (_engagement: EngagementSchedule) => Promise<Engagement>;
    whoIsListeningWidget?: WhoIsListeningWidget;
}

export type EngagementParams = {
    engagementId: string;
};

export const ActionContext = createContext<EngagementViewContext>({
    scheduleEngagement: (_engagement: EngagementSchedule): Promise<Engagement> => {
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
    const [whoIsListeningWidget, setWhoIsListeningWidget] = useState<WhoIsListeningWidget>();
    const [isEngagementLoading, setEngagementLoading] = useState(true);

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

        const fetchWidgets = async () => {
            try {
                const result = await getWidgets(Number(engagementId));
                const whoIsListeningWidget = result.find((w) => w.widget_type_id === WidgetType.WhoIsListening);
                if (!whoIsListeningWidget) return;

                const contacts = await Promise.all(
                    whoIsListeningWidget.items.map((widgetItem) => {
                        return getContact(widgetItem.widget_data_id);
                    }),
                );

                setWhoIsListeningWidget({
                    ...whoIsListeningWidget,
                    contacts: contacts,
                });
            } catch (error) {
                console.log(error);
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Error occurred while fetching Engagement wdigets information',
                    }),
                );
            }
        };

        fetchEngagement();
        fetchWidgets();
    }, [engagementId]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                isEngagementLoading,
                scheduleEngagement,
                whoIsListeningWidget,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
