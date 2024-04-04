import { Widget, WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { Switch, Case } from 'react-if';
import MetWidget from './MetWidget';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';

interface WidgetCardSwitchProps {
    widget: Widget;
    removeWidget: (widgetId: number) => void;
}
export const WidgetCardSwitch = ({ widget, removeWidget }: WidgetCardSwitchProps) => {
    const { handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);

    return (
        <>
            <Switch>
                <Case condition={widget.widget_type_id === WidgetType.Phases}>
                    <MetWidget
                        sortable={false}
                        testId={`phases-${widget.widget_type_id}`}
                        title={widget.title}
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
                    <MetWidget
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
            </Switch>
        </>
    );
};
