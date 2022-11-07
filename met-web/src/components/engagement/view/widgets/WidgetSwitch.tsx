import { Widget, WidgetType } from 'models/widget';
import React from 'react';
import { Switch, Case } from 'react-if';
import WhoIsListeningWidget from '../WhoIsListeningWidget';

interface WidgetCardSwitchProps {
    widget: Widget;
}
export const WidgetSwitch = ({ widget }: WidgetCardSwitchProps) => {
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
