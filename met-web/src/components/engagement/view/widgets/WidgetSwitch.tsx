import React from 'react';
import { Widget, WidgetType } from 'models/widget';
import { Switch, Case } from 'react-if';
import WhoIsListeningWidget from './WhoIsListeningWidget';
import DocumentWidget from './DocumentWidget';
import SubscribeWidget from './Subscribe/SubscribeWidget';
import EventsWidget from './Events/EventsWidget';
import MapWidget from './Map/MapWidget';
import VideoWidgetView from './Video/VideoWidgetView';
interface WidgetSwitchProps {
    widget: Widget;
}

export const WidgetSwitch = ({ widget }: WidgetSwitchProps) => {
    return (
        <>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                    <WhoIsListeningWidget widget={widget} />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.Document}>
                    <DocumentWidget widget={widget} />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.Events}>
                    <EventsWidget widget={widget} />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.Map}>
                    <MapWidget widget={widget} />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.Subscribe}>
                    <SubscribeWidget />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.Video}>
                    <VideoWidgetView widget={widget} />
                </Case>
            </Switch>
        </>
    );
};
