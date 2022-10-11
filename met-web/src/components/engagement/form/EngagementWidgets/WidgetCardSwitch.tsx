import React from 'react';
import { WidgetsList } from '../types';
import { Switch, Case } from 'react-if';
import { MetWidget } from 'components/common';

interface WidgetCardSwitchProps {
    widget: WidgetsList;
}
export const WidgetCardSwitch = ({ widget }: WidgetCardSwitchProps) => {
    return (
        <>
            <Switch>
                <Case condition={widget.widget_type === 1}>
                    <MetWidget
                        testId={`who-is-listening-${widget.widget_type}`}
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
