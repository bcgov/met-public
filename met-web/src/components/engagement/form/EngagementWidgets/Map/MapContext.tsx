import { Widget, WidgetType } from 'models/widget';
import React, { createContext, useContext, useState } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { PreviewMap } from './types';

export interface MapContextProps {
    widget: Widget | null;
    previewMap: PreviewMap | null;
    setPreviewMap: React.Dispatch<React.SetStateAction<PreviewMap | null>>;
    previewMapOpen: boolean;
    setPreviewMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
    previewMap: null,
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
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Map) || null;
    const [previewMap, setPreviewMap] = useState<PreviewMap | null>(null);
    const [previewMapOpen, setPreviewMapOpen] = useState(false);

    return (
        <MapContext.Provider value={{ widget, previewMap, setPreviewMap, previewMapOpen, setPreviewMapOpen }}>
            {children}
        </MapContext.Provider>
    );
};
