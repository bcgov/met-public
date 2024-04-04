import React, { createContext, useContext, useEffect, useState } from 'react';
import { Widget, WidgetType } from 'models/widget';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { useAppDispatch } from 'hooks';
import { fetchPollWidgets } from 'services/widgetService/PollService/index';
import { PollWidget } from 'models/pollWidget';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface PollContextProps {
    widget: Widget | null;
    isLoadingPollWidget: boolean;
    pollWidget: PollWidget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const PollContext = createContext<PollContextProps>({
    widget: null,
    isLoadingPollWidget: true,
    pollWidget: null,
});

export const PollContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Poll) ?? null;
    const [isLoadingPollWidget, setIsLoadingPollWidget] = useState(true);
    const [pollWidget, setPollWidget] = useState<PollWidget | null>(null);

    const loadPollWidget = async () => {
        if (!widget) {
            return;
        }
        try {
            const result = await fetchPollWidgets(widget.id);
            setPollWidget(result[result.length - 1]);
            setIsLoadingPollWidget(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to load Poll data' }));
            setIsLoadingPollWidget(false);
        }
    };

    useEffect(() => {
        loadPollWidget();
    }, [widget]);

    return (
        <PollContext.Provider
            value={{
                widget,
                isLoadingPollWidget,
                pollWidget,
            }}
        >
            {children}
        </PollContext.Provider>
    );
};
