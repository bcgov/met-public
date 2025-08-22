import React, { useContext, useState } from 'react';
import { MetPaper, MetLabel, MetDescription } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../constants';
import { WidgetTabValues } from '../type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/pro-regular-svg-icons/faLocationDot';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';

const Title = 'Map';
const MapOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } =
        useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.Map);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.MAP_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Map,
                engagement_id: savedEngagement.id,
                title: Title,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Map widget successfully created.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.MAP_FORM);
        } catch {
            setIsCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating map widget' }));
            handleWidgetDrawerOpen(false);
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Map}`}
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
                                icon={faLocationDot}
                                style={{ padding: '10px', fontSize: '3em', color: '#757575' }}
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
                                <MetDescription>Add a map with the project location</MetDescription>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default MapOptionCard;
