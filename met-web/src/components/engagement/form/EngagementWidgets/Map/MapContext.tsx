import { Widget, WidgetType } from 'models/widget';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { PreviewMap } from './types';
import { fetchMaps } from 'services/widgetService/MapService';
import { WidgetMap } from 'models/widgetMap';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface MapContextProps {
    widget: Widget | null;
    mapData: WidgetMap | null;
    previewMap: PreviewMap | null;
    setPreviewMap: React.Dispatch<React.SetStateAction<PreviewMap | null>>;
    isLoadingMap: boolean;
    previewMapOpen: boolean;
    setPreviewMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
    mapData: null,
    previewMap: null,
    isLoadingMap: true,
    setPreviewMap: () => {
        throw new Error('setPreviewMap unimplemented');
    },
    previewMapOpen: false,
    setPreviewMapOpen: () => {
        throw new Error('setPreviewMap unimplemented');
    },
});

export const MapProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Map) || null;
    const [mapData, setMapData] = useState<WidgetMap | null>(null);
    const [previewMap, setPreviewMap] = useState<PreviewMap | null>(null);
    const [previewMapOpen, setPreviewMapOpen] = useState(false);
    const [isLoadingMap, setIsLoadingMap] = useState(true);

    const loadMap = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingMap(true);
            const loadedMap = await fetchMaps(widget.id);
            setMapData(loadedMap[loadedMap.length - 1]);
            setIsLoadingMap(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to load map data' }));
            setIsLoadingMap(false);
        }
    };

    useEffect(() => {
        loadMap();
    }, []);

    return (
        <MapContext.Provider
            value={{ isLoadingMap, widget, mapData, previewMap, setPreviewMap, previewMapOpen, setPreviewMapOpen }}
        >
            {children}
        </MapContext.Provider>
    );
};
