import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { postWidget } from 'services/widgetService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../Phases/PhasesOptionCard';
import { WidgetTabValues } from '../type';

const EventsOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } =
        useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);

    const createWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.Events);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.EVENTS_FORM);
            return;
        }

        try {
            setCreatingWidget(!creatingWidget);
            await postWidget(savedEngagement.id, {
                widget_type_id: WidgetType.Events,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Events widget successfully created.',
                }),
            );
            handleWidgetDrawerTabValueChange(WidgetTabValues.EVENTS_FORM);
        } catch (error) {
            setCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating events widget' }));
            handleWidgetDrawerOpen(false);
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Events}`}
            elevation={1}
            sx={optionCardStyle}
            onClick={() => createWidget()}
        >
            <If condition={creatingWidget}>
                <Then>
                    <Grid container alignItems="center" justifyContent="center" direction="row" height="5.5em">
                        <CircularProgress color="inherit" />
                    </Grid>
                </Then>
                <Else>
                    <Grid
                        xs={12}
                        container
                        alignItems="center"
                        justifyContent="flex-start"
                        direction="row"
                        columnSpacing={1}
                    >
                        <Grid item sx={{ mr: 0.5 }}>
                            <EventNoteIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
                        </Grid>
                        <Grid
                            container
                            item
                            alignItems="center"
                            justifyContent="center"
                            direction="row"
                            rowSpacing={1}
                            xs={8}
                        >
                            <Grid item xs={12}>
                                <MetHeader4>Events</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add info about open houses and virtual sessions</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default EventsOptionCard;
