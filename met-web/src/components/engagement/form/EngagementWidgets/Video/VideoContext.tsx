import React, { createContext, useContext, useEffect, useState } from 'react';
import { Widget, WidgetType } from 'models/widget';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { useAppDispatch } from 'hooks';
import { fetchVideoWidgets } from 'services/widgetService/VideoService';
import { VideoWidget } from 'models/videoWidget';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface VideoContextProps {
    widget: Widget | null;
    isLoadingVideoWidget: boolean;
    videoWidget: VideoWidget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const VideoContext = createContext<VideoContextProps>({
    widget: null,
    isLoadingVideoWidget: true,
    videoWidget: null,
});

export const VideoContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Video) ?? null;
    const [isLoadingVideoWidget, setIsLoadingVideoWidget] = useState(true);
    const [videoWidget, setVideoWidget] = useState<VideoWidget | null>(null);

    const loadVideoWidget = async () => {
        if (!widget) {
            return;
        }
        try {
            const result = await fetchVideoWidgets(widget.id);
            setVideoWidget(result[result.length - 1]);
            setIsLoadingVideoWidget(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to load video data' }),
            );
            setIsLoadingVideoWidget(false);
        }
    };

    useEffect(() => {
        loadVideoWidget();
    }, [widget]);

    return (
        <VideoContext.Provider
            value={{
                widget,
                isLoadingVideoWidget,
                videoWidget,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};
