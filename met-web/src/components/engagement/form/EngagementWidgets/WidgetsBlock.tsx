import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { MetHeader2, MetPaper, MetWidget, SecondaryButton } from 'components/common';
import { ActionContext } from '../ActionContext';

const WidgetsBlock = () => {
    const { widgets, handleWidgetDrawerOpen } = useContext(ActionContext);
    return (
        <Grid container item xs={12} rowSpacing={1}>
            <Grid item xs={12}>
                <MetHeader2 bold>Widgets</MetHeader2>
            </Grid>
            <Grid item xs={12}>
                <MetPaper sx={{ padding: '1em' }}>
                    <Grid
                        container
                        direction="row"
                        alignItems={'flex-start'}
                        justifyContent="flex-start"
                        rowSpacing={2}
                    >
                        <Grid item container alignItems={'flex-end'} justifyContent="flex-end">
                            <SecondaryButton onClick={() => handleWidgetDrawerOpen(true)}>Add Widget</SecondaryButton>
                        </Grid>
                        {widgets.map((widget, index) => {
                            return (
                                <Grid item xs={12}>
                                    <MetWidget
                                        key={`${widget.widget_type}-${index}`}
                                        title="Who is Listening"
                                        onDeleteClick={() => {
                                            /**/
                                        }}
                                        onEditClick={() => {
                                            /**/
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </MetPaper>
            </Grid>
        </Grid>
    );
};

export default WidgetsBlock;
