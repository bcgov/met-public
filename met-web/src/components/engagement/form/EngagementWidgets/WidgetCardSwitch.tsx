import { Widget, WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';
import { WidgetDrawerContext } from './WidgetDrawerContext';

interface WidgetCardSwitchProps {
    widget: Widget;
}
export const WidgetCardSwitch = ({ widget }: WidgetCardSwitchProps) => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);

    return (
        <>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                    <MetWidget
                        testId={`who-is-listening-${widget.widget_type_id}`}
                        title="Who is Listening"
                        onDelete={() => {
                            /**/
                        }}
                        onEdit={() => {
                            /**/
                            handleWidgetDrawerOpen(true);
                        }}
                    />
                </Case>
            </Switch>
        </>
    );
};
