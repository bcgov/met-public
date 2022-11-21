import React, { useContext } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { WidgetType } from 'models/widget';
import { Else, If, Then } from 'react-if';

const DocumentOptionCard = () => {
    const { handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);

    const createWidget = async () => {
        handleWidgetDrawerTabValueChange(WidgetTabValues.DOCUMENT_FORM);
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
            <If condition={false}>
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
                                <MetHeader4>Document</MetHeader4>
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
