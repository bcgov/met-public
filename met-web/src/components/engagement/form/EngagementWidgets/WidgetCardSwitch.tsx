import { Widget, WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';

interface WidgetCardSwitchProps {
    singleSelection?: boolean;
    widget: Widget;
    removeWidget: (widgetId: number) => void;
}
export const WidgetCardSwitch = ({ singleSelection = false, widget, removeWidget }: WidgetCardSwitchProps) => {
    const { handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);

    return (
        <Switch>
            <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`who-is-listening-${widget.widget_type_id}`}
                    title={widget.title}
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
                    sortable={!singleSelection}
                    testId={`document-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Subscribe}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`subscribe-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.SUBSCRIBE_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Events}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.EVENTS_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Map}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.MAP_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Video}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.VIDEO_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Timeline}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.TIMELINE_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Poll}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.POLL_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Image}>
                <MetWidget
                    sortable={!singleSelection}
                    testId={`image-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        handleWidgetDrawerTabValueChange(WidgetTabValues.IMAGE_FORM);
                        handleWidgetDrawerOpen(true);
                    }}
                />
            </Case>
        </Switch>
    );
};
