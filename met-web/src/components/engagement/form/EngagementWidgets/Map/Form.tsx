import React, { useContext } from 'react';
import { Grid, Divider } from '@mui/material';
import { PrimaryButton, MetHeader3 } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader3 bold>Map</MetHeader3>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid item>
                    <PrimaryButton
                        onClick={() => {
                            handleWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
