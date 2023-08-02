import React, { useContext, useState } from 'react';
import { MetPaper, MetLabel, MetDescription } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../constants';
import { WidgetTabValues } from '../type';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';

const Title = 'Events';
const EventsOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } =
        useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.Events);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.EVENTS_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Events,
                engagement_id: savedEngagement.id,
                title: Title,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Events widget successfully created.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.EVENTS_FORM);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating events widget' }));
            setIsCreatingWidget(false);
            handleWidgetDrawerOpen(false);
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Events}`}
            elevation={1}
            sx={optionCardStyle}
            onClick={() => handleCreateWidget()}
        >
            <If condition={isCreatingWidget}>
                <Then>
                    <Grid container alignItems="center" justifyContent="center" direction="row" height="5.5em">
                        <CircularProgress color="inherit" />
                    </Grid>
                </Then>
                <Else>
                    <Grid
                        container
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        direction="row"
                        columnSpacing={1}
                    >
                        <Grid item>
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
                                <MetLabel>{Title}</MetLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <MetDescription>
                                    Add information about in-person or virtual information sessions
                                </MetDescription>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default EventsOptionCard;
