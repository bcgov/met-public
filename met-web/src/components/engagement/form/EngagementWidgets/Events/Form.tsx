import React, { useContext } from 'react';
import { Grid, Divider } from '@mui/material';
import { PrimaryButtonOld, WidgetButton } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { EventsContext } from './EventsContext';
import EventsInfoBlock from './EventsInfoBlock';
import { WidgetTitle } from '../WidgetTitle';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { setInPersonFormTabOpen, setVirtualSessionFormTabOpen, widget } = useContext(EventsContext);

    if (!widget) {
        return null;
    }

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                <Grid item>
                    <WidgetButton
                        onClick={() => {
                            setInPersonFormTabOpen(true);
                        }}
                    >
                        Add In-Person Event
                    </WidgetButton>
                </Grid>
                <Grid item>
                    <WidgetButton
                        onClick={() => {
                            setVirtualSessionFormTabOpen(true);
                        }}
                    >
                        Add Virtual Session
                    </WidgetButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <EventsInfoBlock />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid item>
                    <PrimaryButtonOld
                        onClick={() => {
                            handleWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
