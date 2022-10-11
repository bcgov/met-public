import { WidgetsList } from 'models/widget';
import React from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';

interface WidgetCardSwitchProps {
    widget: WidgetsList;
}
export const WidgetCardSwitch = ({ widget }: WidgetCardSwitchProps) => {
    return (
        <>
            <Switch>
                <Case condition={widget.widget_type === 1}>
                    <MetWidget
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
