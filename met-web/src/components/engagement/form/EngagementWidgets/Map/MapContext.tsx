import { Widget, WidgetType } from 'models/widget';
import { WidgetMap } from 'models/widgetMap';
import React, { createContext, useContext, useState } from 'react';
import { WidgetDrawerContext } from '../WidgetDrawerContext';

export interface MapContextProps {
    widget: Widget | null;
    widgetMap: WidgetMap | null;
    setWidgetMap: React.Dispatch<React.SetStateAction<WidgetMap | null>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const MapContext = createContext<MapContextProps>({
    widget: null,
    widgetMap: null,
    setWidgetMap: () => {
        throw new Error('setWidgetMap unimplemented');
    },
});

export const MapProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Map) || null;
    const [widgetMap, setWidgetMap] = useState<WidgetMap | null>(null);

    return <MapContext.Provider value={{ widget, widgetMap, setWidgetMap }}>{children}</MapContext.Provider>;
};
