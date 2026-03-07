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
    const { setWidgetDrawerOpen, setWidgetDrawerTabValue, setWidgetLocation } = useContext(WidgetDrawerContext);
    const openDrawerToTab = (tabValue: (typeof WidgetTabValues)[keyof typeof WidgetTabValues]) => {
        // Set the widget location before opening the drawer
        if (widget.location) {
            setWidgetLocation(widget.location);
        }
        setWidgetDrawerTabValue(tabValue);
        setWidgetDrawerOpen(true);
    };
    return (
        <Switch>
            <Case condition={widget.widget_type_id === WidgetType.WhoIsListening}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`who-is-listening-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.WHO_IS_LISTENING_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Document}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`document-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.DOCUMENT_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Subscribe}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`subscribe-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.SUBSCRIBE_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Events}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.EVENTS_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Map}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.MAP_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Video}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.VIDEO_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Timeline}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.TIMELINE_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Poll}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`event-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.POLL_FORM);
                    }}
                />
            </Case>
            <Case condition={widget.widget_type_id === WidgetType.Image}>
                <MetWidget
                    sortable={!singleSelection}
                    widgetTypeId={widget.widget_type_id}
                    testId={`image-${widget.widget_type_id}`}
                    title={widget.title}
                    onDelete={() => {
                        removeWidget(widget.id);
                    }}
                    onEdit={() => {
                        openDrawerToTab(WidgetTabValues.IMAGE_FORM);
                    }}
                />
            </Case>
        </Switch>
    );
};
