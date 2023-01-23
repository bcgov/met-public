import React from 'react';
import { Widget, WidgetType } from 'models/widget';
import { Switch, Case } from 'react-if';
import WhoIsListeningWidget from './WhoIsListeningWidget';
import DocumentWidget from './DocumentWidget';
import SubscribeWidget from './Subscribe/SubscribeWidget';

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
                <Case condition={widget.widget_type_id === WidgetType.Subscribe}>
                    <SubscribeWidget />
                </Case>
            </Switch>
        </>
    );
};
