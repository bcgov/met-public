import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { WidgetSwitch } from './WidgetSwitch';

const WidgetBlock = () => {
    const { widgets, isWidgetsLoading } = useContext(ActionContext);

    if (isWidgetsLoading) {
        return <Skeleton variant="rectangular" height={'30em'} />;
    }

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={0} rowSpacing={2}>
            {widgets.map((widget) => {
                return (
                    <Grid key={`grid-widget-${widget.id}`} item xs={12}>
                        <WidgetSwitch widget={widget} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default WidgetBlock;
