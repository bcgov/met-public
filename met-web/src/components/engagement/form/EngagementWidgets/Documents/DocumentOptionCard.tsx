import React, { useContext, useState } from 'react';
import { MetPaper, MetLabel, MetDescription } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons/faFileLines';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../constants';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';

const Title = 'Documents';
const DocumentOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.Document);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Document,
                engagement_id: savedEngagement.id,
                title: Title,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created. Proceed to add documents',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
        } catch {
            setIsCreatingWidget(false);
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
                        spacing={1}
                    >
                        <Grid item>
                            <FontAwesomeIcon
                                icon={faFileLines}
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
                                <MetDescription>Add documents and folders</MetDescription>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default DocumentOptionCard;
