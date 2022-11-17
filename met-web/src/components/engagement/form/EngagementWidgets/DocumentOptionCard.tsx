import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';

const DocumentOptionCard = () => {
    const { widgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [creatingWidget, setCreatingWidget] = useState(false);

    const createWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.Document);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
            return;
        }

        try {
            setCreatingWidget(!creatingWidget);
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully created. Proceed to Add Documents.',
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
                            <ArticleIcon sx={{ fontSize: '5em' }} />
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
                                <MetHeader4>Document</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add documents to this engagement</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default DocumentOptionCard;
