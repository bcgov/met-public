import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { Widget } from 'models/widget';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets, patchWidgets, removeWidget } from 'services/widgetService';
import { ActionContext } from '../ActionContext';
import { WidgetTabValues } from './type';
import { updatedDiff } from 'deep-object-diff';

export interface WidgetDrawerContextProps {
    widgets: Widget[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    isWidgetsLoading: boolean;
    loadWidgets: () => Promise<void>;
    updateWidgets: (_widgets: Widget[]) => void;
    deleteWidget: (widgetIndex: number) => void;
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
    updateWidgets: (_widgets: Widget[]) => {
        /* empty default method  */
    },
    deleteWidget: (widgetIndex: number) => {
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

    const updateWidgets = async (_widgets: Widget[]) => {
        try {
            dispatch(openNotification({ severity: 'success', text: 'Update Widgets' }));
            loadWidgets();
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error updating engagement widgets' }));
        }
    };

    const deleteWidget = async (widgetIndex: number) => {
        try {
            removeWidget(savedEngagement.id, widgetIndex);
            dispatch(openNotification({ severity: 'success', text: 'Removed Widget' }));
            loadWidgets();
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error removing widgets' }));
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
