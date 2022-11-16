import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetHeader2, MetPaper, SecondaryButton } from 'components/common';
import { WidgetCardSwitch } from './WidgetCardSwitch';
import { If, Then, Else } from 'react-if';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Widget } from 'models/widget';
import update from 'immutability-helper';

const WidgetsBlock = () => {
    const { widgets, deleteWidget, handleWidgetDrawerOpen, isWidgetsLoading } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const [tempWidgets, setTempWidgets] = useState<Widget[]>(widgets);

    useEffect(() => {
        console.log('WIDGETS!!!!!!!!!!!!!!' + widgets);
        setTempWidgets(widgets);
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

    const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
        console.log(widgets);
        setTempWidgets((prevWidgets: Widget[]) =>
            update(prevWidgets, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevWidgets[dragIndex]],
                ],
            }),
        );
        console.log(tempWidgets);
    }, []);

    const removeWidget = useCallback(async (widgetIndex: number) => {
        console.log('UNDEFINED????' + JSON.stringify(widgets[widgetIndex]) + JSON.stringify(widgets));
        const deletionId = widgets[widgetIndex].id;
        console.log(widgets[widgetIndex]);
        console.log(deletionId);
        deleteWidget(deletionId);
        setTempWidgets((prevWidgets: Widget[]) =>
            update(prevWidgets, {
                $splice: [[widgetIndex, 1]],
            }),
        );
        console.log(tempWidgets);
    }, []);

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
                                {tempWidgets.map((widget: Widget, index) => {
                                    return (
                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}-${index}`}>
                                            <WidgetCardSwitch
                                                key={`${widget.widget_type_id}-${index}`}
                                                widget={widget}
                                                index={index}
                                                moveWidget={moveWidget}
                                                removeWidget={removeWidget}
                                            />
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
