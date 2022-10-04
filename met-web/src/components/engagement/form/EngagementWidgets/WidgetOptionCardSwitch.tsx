import React from 'react';
import { WidgetsList } from '../types';
import { Switch, Case, Default } from 'react-if';
import { MetWidget } from 'components/common';

interface WidgetOptionCardSwitchProps {
    widget: WidgetsList;
}
export const WidgetOptionCardSwitch = ({ widget }: WidgetOptionCardSwitchProps) => {
    return (
        <>
            <Switch>
                <Case condition={widget.widget_type === 1}>
                    <MetWidget
                        title="Who Is Listening"
                        onDeleteClick={() => {
                            /**/
                        }}
                        onEditClick={() => {
                            /**/
                        }}
                    />
                </Case>
            </Switch>
        </>
    );
};
