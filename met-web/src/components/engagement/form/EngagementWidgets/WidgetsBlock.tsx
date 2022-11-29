import React, { useContext, useEffect, useState } from 'react';
import { Divider, Grid, Skeleton } from '@mui/material';
import { MetHeader2, MetPaper, SecondaryButton } from 'components/common';
import { WidgetCardSwitch } from './WidgetCardSwitch';
import { If, Then, Else, When } from 'react-if';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Widget, WidgetType } from 'models/widget';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import update from 'immutability-helper';
import { DragItem } from 'components/common/Dragndrop';

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
        if (!savedEngagement.id) {
            dispatch(
                openNotification({ severity: 'error', text: 'Please create the engagement before adding a widget' }),
            );
            return;
        }
        handleWidgetDrawerOpen(true);
    };

    const moveWidget = (dragIndex: number, hoverIndex: number) => {
        setSortableWidgets((prevWidgets: Widget[]) => {
            const resortedWidgets = update(prevWidgets, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevWidgets[dragIndex]],
                ],
            });
            const widgets = fixedWidgets.concat(resortedWidgets);
            updateWidgetsSorting(widgets);
            return resortedWidgets;
        });
    };

    const removeWidget = (widgetId: number) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Remove Widget',
                    subText: [
                        'You will be removing this widget from the engagement.',
                        'Do you want to remove this widget?',
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
                            <SecondaryButton onClick={handleAddWidgetClick}>Add Widget</SecondaryButton>
                        </Grid>
                        <If condition={isWidgetsLoading}>
                            <Then>
                                <Grid item xs={12}>
                                    <Skeleton width="100%" height="6em" />
                                </Grid>
                            </Then>
                            <Else>
                                {fixedWidgets.map((widget: Widget, index) => {
                                    return (
                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}-${index}`}>
                                            <WidgetCardSwitch
                                                key={`${widget.widget_type_id}-${index}`}
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
                                {sortableWidgets.map((widget: Widget, index) => {
                                    return (
                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}-${index}`}>
                                            <DragItem name={'Widgets'} moveItem={moveWidget} index={index}>
                                                <WidgetCardSwitch
                                                    key={`${widget.widget_type_id}-${index}`}
                                                    widget={widget}
                                                    removeWidget={removeWidget}
                                                />
                                            </DragItem>
                                        </Grid>
                                    );
                                })}
                            </Else>
                        </If>
                    </Grid>
                </MetPaper>
            </Grid>
        </Grid>
    );
};

export default WidgetsBlock;
