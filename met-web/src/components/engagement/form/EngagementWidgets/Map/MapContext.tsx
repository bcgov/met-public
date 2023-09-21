import { Widget, WidgetType } from 'models/widget';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { PreviewMap, GeoJSONInput } from './types';
import { fetchMaps } from 'services/widgetService/MapService';
import { WidgetMap } from 'models/widgetMap';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { geoJSONDecode, calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';
import { GeoJSON } from 'geojson';

export interface MapContextProps {
    widget: Widget | null;
    mapData: WidgetMap | null;
    previewMap: PreviewMap | null;
    setPreviewMap: React.Dispatch<React.SetStateAction<PreviewMap | null>>;
    isLoadingMap: boolean;
    previewMapOpen: boolean;
    setPreviewMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
    zoomLevel: number;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
    mapWidth: number;
    setMapWidth: React.Dispatch<React.SetStateAction<number>>;
    mapHeight: number;
    setMapHeight: React.Dispatch<React.SetStateAction<number>>;
    updateZoom: (geojson: GeoJSONInput) => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
    mapData: null,
    previewMap: null,
    isLoadingMap: true,
    zoomLevel: 12,
    updateZoom: (geojson: GeoJSONInput) => {
        throw new Error('updateZoom unimplemented');
    },
    setZoomLevel: () => {
        throw new Error('setZoomLevel unimplemented');
    },
    setPreviewMap: () => {
        throw new Error('setPreviewMap unimplemented');
    },
    previewMapOpen: false,
    setPreviewMapOpen: () => {
        throw new Error('setPreviewMap unimplemented');
    },
    mapHeight: 500,
    setMapHeight: () => {
        throw new Error('setMapHeight unimplemented');
    },
    mapWidth: 500,
    setMapWidth: () => {
        throw new Error('setMapWidth unimplemented');
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
    const [zoomLevel, setZoomLevel] = useState(12);
    const [mapWidth, setMapWidth] = useState(500);
    const [mapHeight, setMapHeight] = useState(500);

    const loadMap = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingMap(true);
            const loadedMap = await fetchMaps(widget.id);
            setMapData(loadedMap[loadedMap.length - 1]);
            updateZoom(loadedMap[loadedMap.length - 1]?.geojson);
            setIsLoadingMap(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to load map data' }));
            setIsLoadingMap(false);
        }
    };

    const updateZoom = (geojson: GeoJSONInput) => {
        const decodedGeojson = typeof geojson === 'string' ? geoJSONDecode(geojson) : geojson;

        if (decodedGeojson) {
            const zoom = calculateZoomLevel(mapWidth, mapHeight, decodedGeojson as GeoJSON);
            setZoomLevel(zoom);
        }
    };

    useEffect(() => {
        loadMap();
    }, []);

    return (
        <MapContext.Provider
            value={{
                isLoadingMap,
                widget,
                mapData,
                previewMap,
                setPreviewMap,
                previewMapOpen,
                setPreviewMapOpen,
                setZoomLevel,
                zoomLevel,
                mapHeight,
                mapWidth,
                setMapHeight,
                setMapWidth,
                updateZoom,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};
