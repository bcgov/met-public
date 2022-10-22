import { Widget, WidgetType } from 'models/widget';
import React from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';

interface WidgetCardSwitchProps {
    widget: Widget;
}
export const WidgetCardSwitch = ({ widget }: WidgetCardSwitchProps) => {
    return (
        <>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                    <MetWidget
                        testId={`who-is-listening-${widget.widget_type_id}`}
                        title="Who Is Listening"
                        onDelete={() => {
                            /**/
                        }}
                        onEdit={() => {
                            /**/
                        }}
                    />
                </Case>
            </Switch>
        </>
    );
};
