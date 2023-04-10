import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { Widget } from 'models/widget';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets } from 'services/widgetService';
import { ActionContext } from '../ActionContext';
import { WidgetTabValues } from './type';
import { useDeleteWidgetMutation, useSortWidgetsMutation } from 'apiManager/apiSlices/widgets';

export interface WidgetDrawerContextProps {
    widgets: Widget[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    isWidgetsLoading: boolean;
    loadWidgets: () => Promise<void>;
    deleteWidget: (widgetIndex: number) => void;
    updateWidgetsSorting: (widgets: Widget[]) => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const WidgetDrawerContext = createContext<WidgetDrawerContextProps>({
    widgets: [],
    isWidgetsLoading: false,
    widgetDrawerOpen: false,
    handleWidgetDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    widgetDrawerTabValue: WidgetTabValues.WIDGET_OPTIONS,
    handleWidgetDrawerTabValueChange: (_tabValue: string) => {
        /* empty default method  */
    },
    loadWidgets: () => Promise.resolve(),
    deleteWidget: (widgetIndex: number) => {
        /* empty default method  */
    },
    updateWidgetsSorting: (widgets: Widget[]) => {
        /* empty default method  */
    },
});

export const WidgetDrawerProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
    const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);
    const [widgetDrawerTabValue, setWidgetDrawerTabValue] = React.useState(WidgetTabValues.WIDGET_OPTIONS);
    const [removeWidget] = useDeleteWidgetMutation();
    const [sortWidgets] = useSortWidgetsMutation();

    const deleteWidget = async (widgetId: number) => {
        try {
            await removeWidget({ engagementId: savedEngagement.id, widgetId });
            dispatch(openNotification({ severity: 'success', text: 'Removed Widget' }));
            loadWidgets();
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error removing widgets' }));
        }
    };

    const updateWidgetsSorting = async (resortedWidgets: Widget[]) => {
        try {
            await sortWidgets({ engagementId: savedEngagement.id, widgets: resortedWidgets });
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error sorting widgets' }));
        }
    };

    const loadWidgets = async () => {
        if (!savedEngagement.id) {
            setIsWidgetsLoading(false);
            return;
        }

        try {
            const widgetsList = await getWidgets(savedEngagement.id);
            setWidgets(widgetsList);
            setIsWidgetsLoading(false);
        } catch (err) {
            setIsWidgetsLoading(false);
            dispatch(openNotification({ severity: 'error', text: 'Error fetching engagement widgets' }));
        }
    };

    useEffect(() => {
        loadWidgets();
    }, [savedEngagement]);

    const handleWidgetDrawerOpen = (open: boolean) => {
        setWidgetDrawerOpen(open);
    };

    const handleWidgetDrawerTabValueChange = (tabValue: string) => {
        setWidgetDrawerTabValue(tabValue);
    };

    return (
        <WidgetDrawerContext.Provider
            value={{
                widgets,
                deleteWidget,
                updateWidgetsSorting,
                widgetDrawerOpen,
                handleWidgetDrawerOpen,
                widgetDrawerTabValue,
                handleWidgetDrawerTabValueChange,
                isWidgetsLoading,
                loadWidgets,
            }}
        >
            {children}
        </WidgetDrawerContext.Provider>
    );
};
