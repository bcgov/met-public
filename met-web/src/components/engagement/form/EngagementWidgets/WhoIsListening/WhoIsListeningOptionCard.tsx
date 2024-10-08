import React, { useContext, useState } from 'react';
import { MetPaper, MetLabel, MetDescription } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { ActionContext } from '../../ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType, WidgetLocation } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroupSimple } from '@fortawesome/pro-regular-svg-icons/faUserGroupSimple';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';
import { optionCardStyle } from '../constants';

const Title = 'Who is Listening';
const WhoIsListeningOptionCard = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange, widgetLocation } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.WhoIsListening);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.WhoIsListening,
                engagement_id: savedEngagement.id,
                title: Title,
                location: widgetLocation in WidgetLocation ? widgetLocation : 0,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created. Proceed to Add Contacts.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
        } catch (error) {
            setIsCreatingWidget(false);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while creating who is listening widget' }),
            );
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.WhoIsListening}`}
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
                            <FontAwesomeIcon
                                icon={faUserGroupSimple}
                                style={{ padding: '10px 2px 10px 10px', fontSize: '3em', color: '#757575' }}
                            />
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
                                <MetDescription>Add contacts to this engagement</MetDescription>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default WhoIsListeningOptionCard;
