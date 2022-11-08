import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { WidgetSwitch } from './WidgetSwitch';

const WidgetBlock = () => {
    const { widgets } = useContext(ActionContext);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            {widgets.map((widget) => {
                return (
                    <Grid item xs={12}>
                        <WidgetSwitch widget={widget} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default WidgetBlock;
