import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { optionCardStyle } from '../Phases/PhasesOptionCard';
import { WidgetTabValues } from '../type';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';
import MovieIcon from '@mui/icons-material/Movie';

const VideoOptionCard = () => {
    const { widgets, loadWidgets, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } =
        useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.some((widget) => widget.widget_type_id === WidgetType.Video);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.VIDEO_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Video,
                engagement_id: savedEngagement.id,
            }).unwrap();
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Video widget successfully created.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.VIDEO_FORM);
        } catch (error) {
            setIsCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating video widget' }));
            handleWidgetDrawerOpen(false);
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Video}`}
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
                            <MovieIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
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
                                <MetHeader4>Video</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add a link to a hosted video and link preview</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default VideoOptionCard;
