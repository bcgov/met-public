import React, { useContext, useEffect, useState, useRef } from 'react';
import { Divider, Grid, Skeleton } from '@mui/material';
import { MetHeader2, MetPaper, MetTooltip, SecondaryButton } from 'components/common';
import { WidgetCardSwitch } from './WidgetCardSwitch';
import { If, Then, Else, When } from 'react-if';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { Widget, WidgetType } from 'models/widget';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { debounce } from 'lodash';
import { MetDraggable, MetDroppable } from 'components/common/Dragdrop';
import { reorder } from 'utils';

const WidgetsBlock = () => {
    const { widgets, deleteWidget, updateWidgetsSorting, handleWidgetDrawerOpen, isWidgetsLoading } =
        useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const [sortableWidgets, setSortableWidgets] = useState<Widget[]>([]);
    const [fixedWidgets, setFixedWidgets] = useState<Widget[]>([]);

    useEffect(() => {
        const fixedWidgetTypes = [WidgetType.Phases];
        const widgetsFixedList = widgets.filter((w) => fixedWidgetTypes.includes(w.widget_type_id));
        const widgetsSortedList = widgets.filter((w) => !fixedWidgetTypes.includes(w.widget_type_id));
        setFixedWidgets(widgetsFixedList);
        setSortableWidgets(widgetsSortedList);
    }, [widgets]);

    const handleAddWidgetClick = () => {
        handleWidgetDrawerOpen(true);
    };

    const debounceUpdateWidgetsSorting = useRef(
        debounce((wigetsToSort: Widget[]) => {
            updateWidgetsSorting(wigetsToSort);
        }, 800),
    ).current;

    const moveWidget = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(sortableWidgets, result.source.index, result.destination.index);

        setSortableWidgets(items);

        const widgets = fixedWidgets.concat(items);

        debounceUpdateWidgetsSorting(widgets);
    };

    const removeWidget = (widgetId: number) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Remove Widget',
                    subText: [
                        { text: 'You will be removing this widget from the engagement.' },
                        { text: 'Do you want to remove this widget?' },
                    ],
                    handleConfirm: () => {
                        deleteWidget(widgetId);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    return (
        <Grid container item xs={12} rowSpacing={1}>
            <Grid item xs={12}>
                <MetHeader2 bold>Widgets</MetHeader2>
            </Grid>
            <Grid item xs={12}>
                <MetPaper sx={{ padding: '1em' }}>
                    <Grid
                        container
                        direction="row"
                        alignItems={'flex-start'}
                        justifyContent="flex-start"
                        rowSpacing={2}
                    >
                        <Grid item container alignItems={'flex-end'} justifyContent="flex-end">
                            <MetTooltip
                                title={!savedEngagement.id ? 'Please save the engagement before adding a widget.' : ''}
                            >
                                <span>
                                    <SecondaryButton onClick={handleAddWidgetClick} disabled={!savedEngagement.id}>
                                        Add Widget
                                    </SecondaryButton>
                                </span>
                            </MetTooltip>
                        </Grid>
                        <If condition={isWidgetsLoading}>
                            <Then>
                                <Grid item xs={12}>
                                    <Skeleton width="100%" height="6em" />
                                </Grid>
                            </Then>
                            <Else>
                                {fixedWidgets.map((widget: Widget) => {
                                    return (
                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}`}>
                                            <WidgetCardSwitch
                                                key={`${widget.widget_type_id}`}
                                                widget={widget}
                                                removeWidget={removeWidget}
                                            />
                                        </Grid>
                                    );
                                })}
                                <When condition={fixedWidgets.length > 0 && sortableWidgets.length > 0}>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </When>
                                <Grid item xs={12}>
                                    <DragDropContext onDragEnd={moveWidget}>
                                        <MetDroppable droppableId="droppable">
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems={'flex-start'}
                                                justifyContent="flex-start"
                                            >
                                                {sortableWidgets.map((widget: Widget, index) => {
                                                    return (
                                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}`}>
                                                            <MetDraggable draggableId={String(widget.id)} index={index}>
                                                                <WidgetCardSwitch
                                                                    key={`${widget.widget_type_id}`}
                                                                    widget={widget}
                                                                    removeWidget={removeWidget}
                                                                />
                                                            </MetDraggable>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </MetDroppable>
                                    </DragDropContext>
                                </Grid>
                            </Else>
                        </If>
                    </Grid>
                </MetPaper>
            </Grid>
        </Grid>
    );
};

export default WidgetsBlock;
