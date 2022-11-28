import React from 'react';
import { Widget, WidgetType } from 'models/widget';
import { Switch, Case } from 'react-if';
import WhoIsListeningWidget from '../WhoIsListeningWidget';

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
            </Switch>
        </>
    );
};
