import React, { useContext, useEffect } from 'react';
import { WidgetDrawerContext } from 'components/engagement/form/EngagementWidgets/WidgetDrawerContext';
import { Grid, Skeleton } from '@mui/material';
import { If, Else, Then } from 'react-if';
import { useAppDispatch } from 'hooks';
import { colors } from 'styles/Theme';
import { WidgetCardSwitch } from 'components/engagement/form/EngagementWidgets/WidgetCardSwitch';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { WidgetLocation } from 'models/widget';

export const WidgetPickerButton = ({ location }: { location: WidgetLocation }) => {
    const { widgets, deleteWidget, handleWidgetDrawerOpen, isWidgetsLoading, setWidgetLocation } =
        useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setWidgetLocation(location);
        return () => setWidgetLocation(0);
    }, []);

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
        <Grid container spacing={2} direction="column">
            <If condition={isWidgetsLoading}>
                <Then>
                    <Grid item xs={12}>
                        <Skeleton width="100%" height="3em" />
                    </Grid>
                </Then>
                <Else>
                    <Grid item>
                        {/* Only ever render the first selected widget. This may change in the future. */}
                        {widgets.length > 0 ? (
                            <WidgetCardSwitch
                                singleSelection={true}
                                key={`${widgets[0].widget_type_id}`}
                                widget={widgets[0]}
                                removeWidget={removeWidget}
                            />
                        ) : (
                            <button
                                onClick={() => handleWidgetDrawerOpen(true)}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    borderColor: colors.surface.blue[90],
                                    borderWidth: '2px',
                                    borderStyle: 'dashed',
                                    backgroundColor: colors.surface.blue[10],
                                    padding: '3rem',
                                    fontSize: '16px',
                                    color: colors.surface.blue[90],
                                    cursor: 'pointer',
                                }}
                            >
                                Optional Content Widgets
                            </button>
                        )}
                    </Grid>
                </Else>
            </If>
        </Grid>
    );
};
