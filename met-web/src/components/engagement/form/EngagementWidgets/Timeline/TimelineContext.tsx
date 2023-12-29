import React, { createContext, useContext, useEffect, useState } from 'react';
import { Widget, WidgetType } from 'models/widget';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { useAppDispatch } from 'hooks';
import { fetchTimelineWidgets } from 'services/widgetService/TimelineService/index';
import { TimelineWidget } from 'models/timelineWidget';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface TimelineContextProps {
    widget: Widget | null;
    isLoadingTimelineWidget: boolean;
    timelineWidget: TimelineWidget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const TimelineContext = createContext<TimelineContextProps>({
    widget: null,
    isLoadingTimelineWidget: true,
    timelineWidget: null,
});

export const TimelineContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Timeline) ?? null;
    const [isLoadingTimelineWidget, setIsLoadingTimelineWidget] = useState(true);
    const [timelineWidget, setTimelineWidget] = useState<TimelineWidget | null>(null);

    const loadTimelineWidget = async () => {
        if (!widget) {
            return;
        }
        try {
            const result = await fetchTimelineWidgets(widget.id);
            setTimelineWidget(result[result.length - 1]);
            setIsLoadingTimelineWidget(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to load timeline data' }),
            );
            setIsLoadingTimelineWidget(false);
        }
    };

    useEffect(() => {
        loadTimelineWidget();
    }, [widget]);

    return (
        <TimelineContext.Provider
            value={{
                widget,
                isLoadingTimelineWidget,
                timelineWidget,
            }}
        >
            {children}
        </TimelineContext.Provider>
    );
};
