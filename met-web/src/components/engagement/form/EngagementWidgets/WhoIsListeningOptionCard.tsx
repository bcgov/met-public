import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';
import { ActionContext } from '../ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType } from 'models/widget';
import { postWidget } from 'services/widgetService';
import { Else, If, Then } from 'react-if';

const WhoIsListeningOptionCard = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);

    const createWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.WhoIsListening);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
            return;
        }

        try {
            setCreatingWidget(!creatingWidget);
            await postWidget(savedEngagement.id, {
                widget_type_id: WidgetType.WhoIsListening,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created. Proceed to Add Contacts.',
                }),
            );
            handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
        } catch (error) {
            setCreatingWidget(false);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while creating who is listening widget' }),
            );
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.WhoIsListening}`}
            elevation={1}
            sx={{
                padding: '10px 2px 10px 2px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgb(242, 242, 242)' },
            }}
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
                        container
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        direction="row"
                        columnSpacing={2}
                        spacing={1}
                    >
                        <Grid item>
                            <PersonIcon sx={{ fontSize: '5em' }} />
                        </Grid>
                        <Grid
                            container
                            item
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            direction="row"
                            rowSpacing={1}
                            xs={8}
                        >
                            <Grid item xs={12}>
                                <MetHeader4>Who is Listening</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add one or a few contacts to this engagement</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default WhoIsListeningOptionCard;
