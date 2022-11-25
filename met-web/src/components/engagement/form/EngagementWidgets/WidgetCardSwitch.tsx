import { DragItem } from 'components/common/Dragndrop';
import { Widget, WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';


interface WidgetCardSwitchProps {
    widget: Widget;
    index: number;
    moveWidget: (dragIndex: number, hoverIndex: number) => void;
    removeWidget: (widgetId: number) => void;
}
export const WidgetCardSwitch = ({ widget, index, moveWidget, removeWidget }: WidgetCardSwitchProps) => {
    const { handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);

    return (
        <>
            <DragItem name={WidgetType[widget.widget_type_id]} moveItem={moveWidget} index={index}>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.Phases}>
                    <MetWidget
                        sortable={false}
                        testId={`phases-${widget.widget_type_id}`}
                        title="EA Process"
                        onDelete={() => {
                            removeWidget(widget.id);
                        }}
                        onEdit={() => {
                            handleWidgetDrawerTabValueChange(WidgetTabValues.PHASES_FORM);
                            handleWidgetDrawerOpen(true);
                        }}
                    />
                </Case>
                <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                    <DragItem name="Who is Listening" moveItem={moveWidget} index={index}>
                        <MetWidget
                            testId={`who-is-listening-${widget.widget_type_id}`}
                            title="Who is Listening"
                            onDelete={() => {
                                removeWidget(widget.id);
                            }}
                            onEdit={() => {
                                handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
                                handleWidgetDrawerOpen(true);
                            }}
                        />
                    </Case>
                    <Case condition={widget.widget_type_id === WidgetType.Document}>
                        <MetWidget
                            testId={`document-${widget.widget_type_id}`}
                            title="Document"
                            onDelete={() => {
                                removeWidget(widget.id);
                            }}
                            onEdit={() => {
                                handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
                                handleWidgetDrawerOpen(true);
                            }}
                        />
                    </Case>
                </Switch>
            </DragItem>
        </>
    );
};
