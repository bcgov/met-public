import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { Widget } from 'models/widget';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets, removeWidget, sortWidgets } from 'services/widgetService';
import { ActionContext } from '../ActionContext';
import { WidgetTabValues } from './type';

export interface WidgetDrawerContextProps {
    widgets: Widget[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    isWidgetsLoading: boolean;
    loadWidgets: () => Promise<void>;
    deleteWidget: (widgetIndex: number) => void;
    updateWidgets: (sort_index: number) => void;
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
    updateWidgets: (sort_index: number) => {
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

    const deleteWidget = async (widgetId: number) => {
        try {
            await removeWidget(savedEngagement.id, widgetId);
            dispatch(openNotification({ severity: 'success', text: 'Removed Widget' }));
            loadWidgets();
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error removing widgets' }));
        }
    };

    const updateWidgets = async (sort_index: number) => {
        try {
            await sortWidgets(savedEngagement.id, sort_index);
            dispatch(openNotification({ severity: 'success', text: 'updated sorting of widgets' }));
            loadWidgets();
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
            setIsWidgetsLoading(true);
            const widgetsList = await getWidgets(savedEngagement.id);
            setWidgets(widgetsList);
            setIsWidgetsLoading(false);
        } catch (err) {
            console.log(err);
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
                updateWidgets,
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
