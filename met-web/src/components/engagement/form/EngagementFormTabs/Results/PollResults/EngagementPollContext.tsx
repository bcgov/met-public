import React, { createContext, useContext, useEffect, useState } from 'react';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets } from 'services/widgetService';
import { fetchPollWidgets, fetchPollResults } from 'services/widgetService/PollService/index';
import { ActionContext } from '../../../ActionContext';
import { Widget, WidgetType } from 'models/widget';
import { PollWidget, PollResultResponse } from 'models/pollWidget';
import { useAppDispatch } from 'hooks';

export interface EngagementPollContextProps {
    widget: Widget | null;
    isWidgetsLoading: boolean;
    pollWidget: PollWidget | null | undefined;
    isLoadingPollWidget: boolean;
    pollResults: PollResultResponse | null;
    isPollResultsLoading: boolean;
}

export const EngagementPollContext = createContext<EngagementPollContextProps>({
    widget: null,
    isWidgetsLoading: true,
    pollWidget: null,
    isLoadingPollWidget: true,
    pollResults: null,
    isPollResultsLoading: true,
});

export const EngagementPollContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const [widgets, setWidgets] = useState<Widget[] | null>(null);
    const [widget, setWidget] = useState<Widget | null>(null);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
    const [pollWidget, setPollWidget] = useState<PollWidget | null | undefined>(null);
    const [isLoadingPollWidget, setIsLoadingPollWidget] = useState(true);
    const [pollResults, setPollResults] = useState<PollResultResponse | null>(null);
    const [isPollResultsLoading, setIsPollResultsLoading] = useState(true);
    const dispatch = useAppDispatch();

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
        } finally {
            setIsWidgetsLoading(false);
        }
    };

    const loadPollWidget = async () => {
        const widget = widgets?.find((w) => w.widget_type_id === WidgetType.Poll) ?? null;
        setWidget(widget);
        if (!widget) {
            setIsLoadingPollWidget(false);
            return;
        }
        try {
            const result = await fetchPollWidgets(widget.id);
            setPollWidget(result.at(-1));
            setIsLoadingPollWidget(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to load Poll data' }));
            setIsLoadingPollWidget(false);
        } finally {
            setIsLoadingPollWidget(false);
        }
    };

    const getPollResults = async () => {
        try {
            if (!widget || !pollWidget) {
                return;
            }
            const data = await fetchPollResults(widget.id, pollWidget.id);
            setPollResults(data);
            setIsPollResultsLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error fetching poll results' }));
            setIsPollResultsLoading(false);
        } finally {
            setIsPollResultsLoading(false);
        }
    };

    useEffect(() => {
        loadWidgets();
    }, [savedEngagement.id]);

    useEffect(() => {
        loadPollWidget();
    }, [widgets]);

    useEffect(() => {
        getPollResults();
    }, [widget, pollWidget]);

    return (
        <EngagementPollContext.Provider
            value={{
                widget,
                isWidgetsLoading,
                pollWidget,
                isLoadingPollWidget,
                pollResults,
                isPollResultsLoading,
            }}
        >
            {children}
        </EngagementPollContext.Provider>
    );
};
