import { DragItem } from 'components/common/Dragndrop';
import { Widget, WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';
import { WidgetDrawerContext } from './WidgetDrawerContext';

interface WidgetCardSwitchProps {
    widget: Widget;
    index: number;
    moveWidget: (dragIndex: number, hoverIndex: number) => void;
    removeWidget: (widgetIndex: number) => void;
}
export const WidgetCardSwitch = ({ widget, index, moveWidget, removeWidget }: WidgetCardSwitchProps) => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);

    return (
        <>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                    <DragItem name="Who is Listening" moveItem={moveWidget} index={index}>
                        <MetWidget
                            testId={`who-is-listening-${widget.widget_type_id}`}
                            title="Who is Listening"
                            onDelete={() => {
                                removeWidget(index);
                            }}
                            onEdit={() => {
                                handleWidgetDrawerOpen(true);
                            }}
                        />
                    </DragItem>
                </Case>
            </Switch>
        </>
    );
};
