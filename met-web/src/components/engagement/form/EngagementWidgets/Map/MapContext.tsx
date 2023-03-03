import { Widget, WidgetType } from 'models/widget';
import React, { createContext, useContext } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';

export interface MapContextProps {
    widget: Widget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
});

export const MapProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Map) || null;

    return <MapContext.Provider value={{ widget }}>{children}</MapContext.Provider>;
};
