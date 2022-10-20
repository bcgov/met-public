import React, { useContext, useState } from 'react';
import { Divider, Grid } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { MetHeader4, PrimaryButton, SecondaryButton } from 'components/common';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidget } from 'services/widgetService';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetType } from 'models/widget';

const WhoIsListeningCreate = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { handleWidgetDrawerOpen, widgets, loadWidgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);

    const createWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.WhoIsListening);
        if (alreadyExists) {
            dispatch(openNotification({ severity: 'error', text: 'This widget type already exists' }));
        }

        try {
            setCreatingWidget(true);
            await postWidget(savedEngagement.id, {
                widget_type_id: WidgetType.WhoIsListening,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created, you may proceed to add contacts',
                }),
            );
        } catch (error) {
            setCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating widget' }));
        }
    };
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader4 bold>Who is Listening</MetHeader4>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1}>
                <Grid item>
                    <PrimaryButton
                        loading={creatingWidget}
                        onClick={() => createWidget()}
                        sx={{ height: '100%' }}
                        fullWidth
                    >
                        Create widget
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WhoIsListeningCreate;
