import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { postWidget } from 'services/widgetService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../Phases/PhasesOptionCard';
const SubscribeOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);

    const createWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.Subscribe);
        if (alreadyExists) {
            return;
        }

        try {
            setCreatingWidget(!creatingWidget);
            await postWidget(savedEngagement.id, {
                widget_type_id: WidgetType.Subscribe,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created.',
                }),
            );
            handleWidgetDrawerOpen(false);
        } catch (error) {
            setCreatingWidget(false);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while creating subscription widget' }),
            );
            handleWidgetDrawerOpen(false);
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Subscribe}`}
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
                            <EmailOutlinedIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
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
                                <MetHeader4>Sign Up for Updates</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Offer members of the public to sign up for updates</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default SubscribeOptionCard;
