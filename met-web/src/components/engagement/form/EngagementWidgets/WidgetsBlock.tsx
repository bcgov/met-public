import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetHeader2, MetPaper, SecondaryButton } from 'components/common';
import { WidgetCardSwitch } from './WidgetCardSwitch';
import { If, Then, Else } from 'react-if';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const WidgetsBlock = () => {
    const { widgets, handleWidgetDrawerOpen, isWidgetsLoading } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const handleAddWidgetClick = () => {
        if (!savedEngagement.id) {
            dispatch(
                openNotification({ severity: 'error', text: 'Please create the engagement before adding a widget' }),
            );
            return;
        }
        handleWidgetDrawerOpen(true);
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
                                {widgets.map((widget, index) => {
                                    return (
                                        <Grid item xs={12} key={`Grid-${widget.widget_type_id}-${index}`}>
                                            <WidgetCardSwitch
                                                key={`${widget.widget_type_id}-${index}`}
                                                widget={widget}
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
