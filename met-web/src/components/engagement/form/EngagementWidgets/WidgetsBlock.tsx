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
    const { widgets, handleWidgetDrawerOpen, isWidgetsLoading } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const [tempWidgets, setTempWidgets] = useState<Widget[]>([
        {
            created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
            created_date: '2022-11-02 13:26:57.528836',
            engagement_id: 80,
            id: 4,
            items: [
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-02 13:36:30.988877',
                    id: 1,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-02 13:36:30.988881',
                    widget_data_id: 1,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-02 14:34:33.445205',
                    id: 2,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-02 14:34:33.445208',
                    widget_data_id: 3,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-07 20:26:11.617105',
                    id: 3,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-07 20:26:11.617107',
                    widget_data_id: 2,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-07 20:26:11.617166',
                    id: 4,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-07 20:26:11.617166',
                    widget_data_id: 5,
                    widget_id: 4,
                },
            ],
            updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
            updated_date: '2022-11-02 13:26:57.528843',
            widget_type_id: 1,
        },

        {
            created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
            created_date: '2022-11-02 13:26:57.528836',
            engagement_id: 80,
            id: 4,
            items: [
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-02 13:36:30.988877',
                    id: 1,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-02 13:36:30.988881',
                    widget_data_id: 1,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-02 14:34:33.445205',
                    id: 2,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-02 14:34:33.445208',
                    widget_data_id: 3,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-07 20:26:11.617105',
                    id: 3,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-07 20:26:11.617107',
                    widget_data_id: 2,
                    widget_id: 4,
                },
                {
                    created_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    created_date: '2022-11-07 20:26:11.617166',
                    id: 4,
                    updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
                    updated_date: '2022-11-07 20:26:11.617166',
                    widget_data_id: 5,
                    widget_id: 4,
                },
            ],
            updated_by: 'd1eb5858-1311-4dd9-8e7a-6ff9a9398a00',
            updated_date: '2022-11-02 13:26:57.528843',
            widget_type_id: 2,
        },
    ]);

    useEffect(() => {
        console.log(widgets);
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
        setTempWidgets((prevWidgets: Widget[]) =>
            update(prevWidgets, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevWidgets[dragIndex]],
                ],
            }),
        );
    }, []);

    const removeWidget = useCallback((widgetIndex: number) => {
        setTempWidgets((prevWidgets: Widget[]) =>
            update(prevWidgets, {
                $splice: [[widgetIndex, 1]],
            }),
        );
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
