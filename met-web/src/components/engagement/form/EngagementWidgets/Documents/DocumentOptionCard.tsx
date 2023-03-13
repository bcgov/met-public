import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../Phases/PhasesOptionCard';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';
const DocumentOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);
    const [createWidget] = useCreateWidgetMutation();

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.Document);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
            return;
        }

        try {
            setCreatingWidget(!creatingWidget);
            await createWidget({
                widget_type_id: WidgetType.Document,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created. Proceed to add documents',
                }),
            );
            handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
        } catch (error) {
            setCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating document widget' }));
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Document}`}
            elevation={1}
            sx={optionCardStyle}
            onClick={() => handleCreateWidget()}
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
                        alignItems="center"
                        justifyContent="flex-start"
                        direction="row"
                        columnSpacing={1}
                        spacing={1}
                    >
                        <Grid item>
                            <DescriptionOutlinedIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
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
                                <MetHeader4>Documents</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add a document</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default DocumentOptionCard;
