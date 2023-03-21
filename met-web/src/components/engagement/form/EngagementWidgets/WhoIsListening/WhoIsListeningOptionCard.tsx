import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { ActionContext } from '../../ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { optionCardStyle } from '../Phases/PhasesOptionCard';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';

const WhoIsListeningOptionCard = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.WhoIsListening);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
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
                    <Grid container alignItems="center" justifyContent="flex-start" direction="row" columnSpacing={1}>
                        <Grid item sx={{ mr: 0.5 }}>
                            <PeopleAltOutlinedIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
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
