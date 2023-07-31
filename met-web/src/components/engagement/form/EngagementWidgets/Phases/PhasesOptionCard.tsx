import React, { useContext, useState } from 'react';
import { MetPaper, MetLabel, MetDescription } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { ActionContext } from '../../ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType } from 'models/widget';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';
import { Else, If, Then } from 'react-if';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { optionCardStyle } from '../constants';

const PhasesOptionCard = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.Phases);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.PHASES_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Phases,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully added.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.PHASES_FORM);
        } catch (error) {
            setIsCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while adding phases widget' }));
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Phases}`}
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
                        columnSpacing={2}
                        spacing={1}
                    >
                        <Grid item>
                            <ChatBubbleOutlineOutlinedIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
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
                                <MetLabel>Environmental Assessment Process</MetLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <MetDescription>
                                    Add the environmental assessment process info to this engagement
                                </MetDescription>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default PhasesOptionCard;
