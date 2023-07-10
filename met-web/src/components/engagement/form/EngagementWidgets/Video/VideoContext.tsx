import { Widget, WidgetType } from 'models/widget';
import React, { createContext, useContext } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { useAppDispatch } from 'hooks';

export interface VideoContextProps {
    widget: Widget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const VideoContext = createContext<VideoContextProps>({
    widget: null,
});

export const VideoContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Video) || null;

    return <VideoContext.Provider value={{ widget }}>{children}</VideoContext.Provider>;
};
