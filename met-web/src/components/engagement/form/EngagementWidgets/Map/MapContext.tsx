import { Widget, WidgetType } from 'models/widget';
import { WidgetMap } from 'models/widgetMap';
import React, { createContext, useContext, useState } from 'react';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postMap } from 'services/widgetService/MapService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';

export interface MapContextProps {
    widget: Widget | null;
    mapDetailsDrawerOpen: boolean;
    setMapDetailsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widgetMap: WidgetMap | null;
    setWidgetMap: React.Dispatch<React.SetStateAction<WidgetMap | null>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
    mapDetailsDrawerOpen: false,
    setMapDetailsDrawerOpen: () => {
        throw new Error('setMapDetailsDrawerOpen unimplemented');
    },
    widgetMap: null,
    setWidgetMap: () => {
        throw new Error('setWidgetMap unimplemented');
    },
});

export const MapProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Map) || null;
    const [mapDetailsDrawerOpen, setMapDetailsDrawerOpen] = useState(false);
    const [widgetMap, setWidgetMap] = useState<WidgetMap | null>(null);

    return (
        <MapContext.Provider value={{ widget, mapDetailsDrawerOpen, setMapDetailsDrawerOpen, widgetMap, setWidgetMap }}>
            {children}
        </MapContext.Provider>
    );
};
